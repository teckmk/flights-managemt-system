import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import AlertConfig from "@/lib/db/models/AlertConfig";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    const config = await AlertConfig.findOneAndUpdate(
      { userId: "current-user-id" }, // Replace with actual user ID from session
      { ...data },
      { upsert: true, new: true }
    );
    
    return NextResponse.json(config, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save alert configuration" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const config = await AlertConfig.findOne({
      userId: "current-user-id", // Replace with actual user ID from session
    });
    
    return NextResponse.json(config || {});
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch alert configuration" },
      { status: 500 }
    );
  }
}