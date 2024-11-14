import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { FlightService } from "@/lib/services/FlightService";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Add status as Scheduled for new flights
    const flightData = {
      ...data,
      status: "Scheduled",
    };

    const flight = await FlightService.createFlight(flightData);

    return NextResponse.json(flight, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to schedule flight" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const type = searchParams.get("type");

    const filters: Record<string, any> = {
      status: "Scheduled",
    };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      filters.scheduledDeparture = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (type) {
      filters.type = type;
    }

    const flights = await FlightService.getFlights(1, 100, filters);

    return NextResponse.json(flights);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch schedule",
      },
      { status: 500 }
    );
  }
}
