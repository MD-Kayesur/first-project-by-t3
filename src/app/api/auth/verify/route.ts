import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }

    const existingToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ message: "Token does not exist!" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ message: "Token has expired!" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email: existingToken.identifier },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "Email does not exist!" }, { status: 400 });
    }

    // Update user's emailVerified date
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.identifier, // in case they were changing their email
      },
    });

    // Remove the token so it can't be reused
    await db.verificationToken.delete({
      where: { token: existingToken.token },
    });

    // Note: The previous delete was wrong if it used identifier_token, let's fix that.
    // We can just redirect them to the auth page with a success flag
    return NextResponse.redirect(new URL("/auth?verified=true", req.url));
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
