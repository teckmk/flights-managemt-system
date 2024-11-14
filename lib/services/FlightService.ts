import { Flight, FlightStatus } from "@/lib/types/flight";
import FlightModel from "@/lib/db/models/Flight";
import { cache } from "./RedisService";
import { logger } from "@/lib/utils/logger";
import { flightChannel } from "../constants/socket";
import { randomInt } from "node:crypto";

export class FlightService {
  private static readonly RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  private static async emitFlightUpdate(
    action: "created" | "updated",
    data: any
  ) {
    let attempts = 0;
    let success = false;

    while (attempts < this.RETRY_ATTEMPTS && !success) {
      try {
        const io = globalThis.io;
        logger.info(`io is ${io}`);

        let topic = flightChannel.FLIGHT_UPDATE;
        if (action === "created") {
          topic = flightChannel.FLIGHT_CREATE;
        } else if (action === "updated") {
          topic = flightChannel.FLIGHT_UPDATE;
        }

        io?.emit(topic, data);

        success = true;
        logger.info(`Successfully processed update for flight ${data.id}`);
      } catch (error) {
        attempts++;
        logger.error(
          `Attempt ${attempts} failed for update on flight ${data.id}:`,
          error
        );
        if (attempts < this.RETRY_ATTEMPTS) {
          await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        }
      }
    }

    if (!success) {
      logger.error(`All retry attempts failed for update on flight ${data.id}`);
    }
  }

  static async updateFlightStatus(
    flightId: string,
    status: FlightStatus,
    updateData: Partial<Flight> = {}
  ) {
    const flight = await FlightModel.findByIdAndUpdate(
      flightId,
      { status, ...updateData },
      { new: true }
    );

    if (!flight) {
      throw new Error("Flight not found");
    }

    // Invalidate cache
    await cache.del("flights:*");

    return flight;
  }

  static async getFlights(page = 1, limit = 10, filters: Partial<Flight> = {}) {
    const cacheKey = `flights:${JSON.stringify({ page, limit, filters })}`;
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const query = this.buildQuery(filters);
    const flights = await FlightModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ scheduledDeparture: 1 });

    const total = await FlightModel.countDocuments(query);

    const result = {
      flights,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    await cache.set(cacheKey, JSON.stringify(result), "EX", 300); // Cache for 5 minutes
    return result;
  }

  private static buildQuery(filters: Partial<Flight>) {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.airline) {
      query.airline = filters.airline;
    }

    if (filters.origin) {
      query.origin = { $regex: filters.origin, $options: "i" };
    }

    if (filters.destination) {
      query.destination = { $regex: filters.destination, $options: "i" };
    }

    return query;
  }

  /**
   * Creates a new flight record in the database.
   * @param flightData Data for the new flight
   */
  static async createFlight(flightData: Partial<Flight>) {
    try {
      const flight = new FlightModel(flightData);
      await flight.save();

      this.emitFlightUpdate("created", flight);

      // Clear cache for flights since data has changed
      await cache.del("flights:*");

      logger.info(`Flight ${flight.flightNumber} created successfully`);
      return flight;
    } catch (error) {
      logger.error("Error creating flight:", error);
      throw new Error("Failed to create flight");
    }
  }

  static async updateFlight(flightId: string, updateData: Partial<Flight>) {
    try {
      const flight = await FlightModel.findByIdAndUpdate(flightId, updateData, {
        new: true,
      });

      if (!flight) throw new Error("Flight not found");

      this.emitFlightUpdate("updated", flight);

      // Clear cache for flights
      await cache.del("flights:*");

      logger.info(`Flight ${flight.flightNumber} updated successfully`);
      return flight;
    } catch (error) {
      logger.error(`Error updating flight with ID ${flightId}:`, error);
      throw new Error("Failed to update flight");
    }
  }

  static async deleteFlight(flightId: string) {
    try {
      const result = await FlightModel.findByIdAndDelete(flightId);

      if (!result) throw new Error("Flight not found");

      // Clear cache for flights
      await cache.del("flights:*");

      logger.info(`Flight with ID ${flightId} deleted successfully`);
      return result;
    } catch (error) {
      logger.error(`Error deleting flight with ID ${flightId}:`, error);
      throw new Error("Failed to delete flight");
    }
  }

  static async getStats() {
    const totalFlightsToday = await FlightModel.countDocuments({
      scheduledDeparture: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    const delayedFlights = await FlightModel.countDocuments({
      status: "Delayed",
    });
    const cancelledFlights = await FlightModel.countDocuments({
      status: "Cancelled",
    });
    const onTimeFlights = await FlightModel.countDocuments({
      status: "Scheduled",
    });
    const inFlightFlights = await FlightModel.countDocuments({
      status: "In-flight",
    });

    const landedFlights = await FlightModel.countDocuments({
      status: "Landed",
    });

    const totalPassengers = await FlightModel.aggregate([
      { $group: { _id: null, total: { $sum: "$passengers" } } },
    ]);

    return {
      totalFlightsToday,
      delayedFlights,
      cancelledFlights,
      onTimeFlights,
      inFlightFlights,
      landedFlights,
      totalPassengers: totalPassengers[0]?.total || 0,
    };
  }

  static async getScheduledDepartures() {
    const times = [
      { hour: 0, label: "00:00" },
      { hour: 3, label: "03:00" },
      { hour: 6, label: "06:00" },
      { hour: 9, label: "09:00" },
      { hour: 12, label: "12:00" },
      { hour: 15, label: "15:00" },
      { hour: 18, label: "18:00" },
      { hour: 21, label: "21:00" },
    ];

    // Collect flight data for each time range
    const flightDataByTime = await Promise.all(
      times.map(async ({ hour, label }) => {
        const startTime = new Date();
        startTime.setHours(hour, 0, 0, 0);
        const endTime = new Date();
        endTime.setHours(hour + 3, 0, 0, 0);

        const scheduledCount = await FlightModel.countDocuments({
          scheduledDeparture: { $gte: startTime, $lt: endTime },
        });
        const inFlightCount = await FlightModel.countDocuments({
          status: "In-flight",
          actualDeparture: { $gte: startTime, $lt: endTime },
        });
        const delayedCount = await FlightModel.countDocuments({
          status: "Delayed",
          scheduledDeparture: { $gte: startTime, $lt: endTime },
        });

        return {
          time: label,
          scheduled: scheduledCount,
          inFlight: inFlightCount,
          delayed: delayedCount,
        };
      })
    );

    return flightDataByTime;
  }

  static async getFlightDistibution() {
    const flightTypeDistribution = await FlightModel.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } },
    ]);

    return flightTypeDistribution;
  }

  static async getRecentFlights() {
    const recentFlights = await FlightModel.find()
      .sort({ scheduledDeparture: -1 })
      .limit(10)
      .select(
        "id flightNumber airline origin destination scheduledDeparture status type"
      )
      .lean();

    return recentFlights;
  }

  /**
   * Periodically generates random flights, saves them to the database, and emits an update on the socket.
   */
  static async generateRandomFlightsPeriodically(interval: number = 60000) {
    const airlines = [
      "American Airlines",
      "Delta Air Lines",
      "United Airlines",
      "Southwest Airlines",
      "JetBlue Airways",
      "Alaska Airlines",
      "Spirit Airlines",
      "Frontier Airlines",
      "Hawaiian Airlines",
      "Allegiant Air",
      "British Airways",
      "Air Canada",
      "Lufthansa",
      "Emirates",
      "Qatar Airways",
    ];

    const flightStatus = [
      "Scheduled",
      "Delayed",
      "Cancelled",
      "In-flight",
      "Landed",
    ];

    const aircraftNames = [
      "Boeing 737",
      "Airbus A320",
      "Embraer 175",
      "Boeing 777",
      "Airbus A350",
      "Boeing 747",
      "Airbus A380",
      "Boeing 767",
      "Airbus A330",
      "Boeing 787 Dreamliner",
      "Embraer 190",
      "Bombardier CRJ200",
      "McDonnell Douglas MD-80",
      "Boeing 757",
      "Airbus A221",
      "Bombardier Q400",
      "Boeing 727",
      "Fokker 100",
    ];

    const origin = ["JFK", "LAX", "ORD", "ATL", "DFW", "DEN"];
    const destination = ["SFO", "MIA", "SEA", "BOS", "PHX", "LAS"];
    const type = ["Commercial", "Military", "Private"];

    setInterval(async () => {
      const numFlights = randomInt(1, 5); // Generate between 1 and 5 flights
      const newFlights = [];

      for (let i = 0; i < numFlights; i++) {
        const airline = airlines[randomInt(0, airlines.length)];
        const airlineCode = airline.split(" ")[0].slice(0, 2).toUpperCase(); // Get the airline code (first 2 letters)
        const flightNumber = `${airlineCode}${randomInt(1000, 9999)}`; // Combine airline code and random number

        const flightData = {
          flightNumber: flightNumber,
          airline: airline,
          origin: origin[randomInt(0, origin.length)],
          destination: destination[randomInt(0, destination.length)],
          scheduledDeparture: new Date(Date.now() + randomInt(60000, 3600000)), // random departure time within 1 hour
          scheduledArrival: new Date(Date.now() + randomInt(3600000, 7200000)), // random arrival time between 1 and 2 hours after departure
          status: flightStatus[randomInt(0, flightStatus.length)],
          type: type[randomInt(0, type.length)],
          aircraft: aircraftNames[randomInt(0, aircraftNames.length)],
          capacity: randomInt(100, 300),
          passengers: randomInt(50, 300),
        };

        const flight = new FlightModel(flightData);
        await flight.save();
        newFlights.push(flight);
      }

      if (newFlights.length > 0) {
        await this.emitFlightUpdate("created", newFlights);
      }
    }, interval);
  }
}
