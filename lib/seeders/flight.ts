import mongoose from "mongoose";
import { connectDB } from "../db/mongodb";
import FlightModel from "../db/models/Flight";
import { FlightStatus, FlightType } from "@/lib/types/flight";

const flightsToSeed = [
  {
    flightNumber: "AA101",
    origin: "JFK",
    destination: "LAX",
    scheduledDeparture: new Date("2024-11-15T10:00:00Z"),
    scheduledArrival: new Date("2024-11-15T13:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "American Airlines",
    aircraft: "Boeing 737",
    capacity: 180,
    passengers: 150,
  },
  {
    flightNumber: "UA202",
    origin: "ORD",
    destination: "SFO",
    scheduledDeparture: new Date("2024-11-15T12:00:00Z"),
    scheduledArrival: new Date("2024-11-15T15:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "United Airlines",
    aircraft: "Airbus A320",
    capacity: 160,
    passengers: 130,
  },
  {
    flightNumber: "DL303",
    origin: "ATL",
    destination: "SEA",
    scheduledDeparture: new Date("2024-11-15T14:00:00Z"),
    scheduledArrival: new Date("2024-11-15T17:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "Delta Airlines",
    aircraft: "Boeing 757",
    capacity: 200,
    passengers: 190,
  },
  {
    flightNumber: "SW404",
    origin: "PHX",
    destination: "LAS",
    scheduledDeparture: new Date("2024-11-15T15:00:00Z"),
    scheduledArrival: new Date("2024-11-15T16:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "Southwest Airlines",
    aircraft: "Boeing 737",
    capacity: 150,
    passengers: 120,
  },
  {
    flightNumber: "BA505",
    origin: "LHR",
    destination: "JFK",
    scheduledDeparture: new Date("2024-11-15T16:00:00Z"),
    scheduledArrival: new Date("2024-11-15T20:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "British Airways",
    aircraft: "Boeing 747",
    capacity: 300,
    passengers: 280,
  },
  {
    flightNumber: "AF606",
    origin: "CDG",
    destination: "ATL",
    scheduledDeparture: new Date("2024-11-15T17:00:00Z"),
    scheduledArrival: new Date("2024-11-15T21:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "Air France",
    aircraft: "Airbus A380",
    capacity: 350,
    passengers: 330,
  },
  {
    flightNumber: "EK707",
    origin: "DXB",
    destination: "SYD",
    scheduledDeparture: new Date("2024-11-15T18:00:00Z"),
    scheduledArrival: new Date("2024-11-16T04:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "Emirates",
    aircraft: "Boeing 777",
    capacity: 400,
    passengers: 370,
  },
  {
    flightNumber: "QF808",
    origin: "SYD",
    destination: "LAX",
    scheduledDeparture: new Date("2024-11-15T20:00:00Z"),
    scheduledArrival: new Date("2024-11-15T23:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "Qantas",
    aircraft: "Airbus A380",
    capacity: 300,
    passengers: 250,
  },
  {
    flightNumber: "LH909",
    origin: "FRA",
    destination: "ORD",
    scheduledDeparture: new Date("2024-11-15T22:00:00Z"),
    scheduledArrival: new Date("2024-11-16T02:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "Lufthansa",
    aircraft: "Airbus A350",
    capacity: 270,
    passengers: 220,
  },
  {
    flightNumber: "NH1010",
    origin: "NRT",
    destination: "HNL",
    scheduledDeparture: new Date("2024-11-15T23:00:00Z"),
    scheduledArrival: new Date("2024-11-16T09:00:00Z"),
    status: "Scheduled" as FlightStatus,
    type: "Commercial" as FlightType,
    airline: "All Nippon Airways",
    aircraft: "Boeing 787",
    capacity: 280,
    passengers: 240,
  },
];

const seedFlights = async () => {
  await connectDB();

  for (const flight of flightsToSeed) {
    try {
      const existingFlight = await FlightModel.findOne({
        flightNumber: flight.flightNumber,
      });
      if (existingFlight) {
        console.log(`Flight ${flight.flightNumber} already exists. Skipping.`);
        continue;
      }

      const newFlight = new FlightModel(flight);
      await newFlight.save();
      console.log(`Flight ${flight.flightNumber} seeded successfully!`);
    } catch (error) {
      console.error(`Error seeding flight ${flight.flightNumber}:`, error);
    }
  }

  mongoose.connection.close();
};

seedFlights().catch((error) => {
  console.error("Error running flight seeder:", error);
  mongoose.connection.close();
});
