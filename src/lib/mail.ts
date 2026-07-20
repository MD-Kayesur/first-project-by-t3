import { db } from "~/server/db";

// Helper function to generate a secure random token
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generateVerificationToken = async (email: string) => {
  const token = generateToken();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  // Remove existing token if it exists
  const existingToken = await db.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: existingToken.token,
        },
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = generateToken();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await db.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

// DUMMY EMAIL SENDERS (Logs to console for local testing)
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/api/auth/verify?token=${token}`;

  console.log("==========================================================");
  console.log("📩 INCOMING EMAIL (Mock)");
  console.log(`To: ${email}`);
  console.log(`Subject: Verify your email address`);
  console.log(`Click this link to verify your email: ${confirmLink}`);
  console.log("==========================================================");
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

  console.log("==========================================================");
  console.log("📩 INCOMING EMAIL (Mock)");
  console.log(`To: ${email}`);
  console.log(`Subject: Reset your password`);
  console.log(`Click this link to reset your password: ${resetLink}`);
  console.log("==========================================================");
};
