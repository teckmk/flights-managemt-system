import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { FlightService } from "@/lib/services/FlightService";

export async function GET(req: Request) {
  try {
    await connectDB();

    const flights = await FlightService.getStats();

    return NextResponse.json(flights);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch flights" },
      { status: 500 }
    );
  }
}
