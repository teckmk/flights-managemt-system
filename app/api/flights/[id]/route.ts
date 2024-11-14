import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { FlightService } from "@/lib/services/FlightService";
import { logger } from "@/lib/utils/logger";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await req.json();

    const flight = await FlightService.updateFlight(params.id, data);

    return NextResponse.json(flight);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update flight" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    await FlightService.deleteFlight(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete flight" },
      { status: 500 }
    );
  }
}
