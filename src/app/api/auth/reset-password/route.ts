import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "~/server/db";

// Rate limiter to prevent brute force on reset-password
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const rateLimitCheck = (ip: string) => {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 5;

  const record = rateLimit.get(ip);
  if (!record) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > windowMs) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= limit) return false;
  record.count += 1;
  return true;
};

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (!rateLimitCheck(ip)) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Missing token or password" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json(
        { message: "Invalid or missing token" },
        { status: 400 }
      );
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json(
        { message: "Token has expired" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User does not exist!" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
