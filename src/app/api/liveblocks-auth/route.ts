import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import { getRandomUser } from "@/database";

const LIVEBLOCKS_SECRET_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

if (!LIVEBLOCKS_SECRET_KEY) {
  throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
}

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get the current user's unique id and info from your database
    const user = getRandomUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the room id from the request body
    const { room } = await request.json();

    if (!room) {
      return NextResponse.json({ error: "Room id is required" }, { status: 400 });
    }

    // Create a session for the current user
    const session = liveblocks.prepareSession(`${user.id}`, {
      userInfo: user.info,
    });

    // Allow access to the specific room
    session.allow(room, session.FULL_ACCESS);

    // Authorize the user and return the result
    const { body, status } = await session.authorize();
    return new NextResponse(body, { status });
  } catch (error) {
    console.error("Liveblocks authentication error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}