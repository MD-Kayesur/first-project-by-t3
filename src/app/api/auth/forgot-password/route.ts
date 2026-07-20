import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { generatePasswordResetToken, sendPasswordResetEmail } from "~/lib/mail";

// Rate limiter for forgot-password
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const rateLimitCheck = (ip: string) => {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 3;

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

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    // If user exists, generate token and send email.
    // If not, we do NOTHING but still return success to prevent email enumeration attacks.
    if (existingUser && existingUser.password) {
      const passwordResetToken = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
      );
    }

    return NextResponse.json(
      { message: "If an account exists with that email, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
