import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Hash password
    const hashedPassword = await hash(data.password, 12);
    
    const user = await User.create({
      name: data.name,
      email: data.email,
      role: data.role,
      password: hashedPassword,
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
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
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    
    const query: any = {};
    if (role) query.role = role;
    if (status) query.status = status;
    
    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}