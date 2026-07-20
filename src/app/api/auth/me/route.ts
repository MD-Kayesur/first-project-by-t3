import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
  try {
    // 1. Get the current session
    const session = await auth();

    // 2. If no active session, user is not logged in
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 3. Fetch the latest user data from the database using their ID
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      // Select only the fields we want to expose (never the password!)
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
      },
    });

    // 4. If somehow the user is missing in the database
    if (!user) {
      return NextResponse.json({ message: "User not found in database" }, { status: 404 });
    }

    // 5. Return the fresh user data
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
