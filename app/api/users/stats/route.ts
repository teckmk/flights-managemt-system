import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const inactiveUsers = totalUsers - activeUsers;

    const rolesCount = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const recentActivity = {
      newUsers: await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      deactivated: await User.countDocuments({
        status: "inactive",
        updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    };

    return NextResponse.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      rolesCount,
      recentActivity,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
