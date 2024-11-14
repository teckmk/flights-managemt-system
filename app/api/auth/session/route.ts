import { createToken, verifyToken } from "@/lib/services/SessionService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const token = cookies.match(/auth-token=([^;]*)/)?.[1];
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const verified = await verifyToken(token);
    if (!verified) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const tokenExp = verified.exp as number;
    const nowInSecs = Math.floor(Date.now() / 1000);
    const TEN_MINUTES = 10 * 60;

    if (tokenExp - nowInSecs <= TEN_MINUTES) {
      const { exp, iat, ...payload } = verified;
      const newToken = await createToken(payload);

      const response = NextResponse.json({ message: "Session updated" });
      response.cookies.set("auth-token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json({ message: "Session still valid" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update session" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const token = cookies.match(/auth-token=([^;]*)/)?.[1];
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const verified = await verifyToken(token);
    if (!verified) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Session data retrieved successfully",
      session: verified,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
