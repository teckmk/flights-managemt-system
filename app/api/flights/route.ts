import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { FlightService } from "@/lib/services/FlightService";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const flight = await FlightService.createFlight(data);

    return NextResponse.json(flight, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create flight" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const filters: any = {};
    if (status) filters.status = status;
    if (type) filters.type = type;

    const flights = await FlightService.getFlights(page, limit, filters);

    return NextResponse.json(flights);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch flights" },
      { status: 500 }
    );
  }
}
