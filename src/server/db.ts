import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma";

const getDbProviderName = (url: string) => {
  if (url.startsWith("mongodb://") || url.startsWith("mongodb+srv://")) return "MongoDB";
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) return "PostgreSQL";
  if (url.startsWith("mysql://")) return "MySQL";
  if (url.startsWith("file:")) return "SQLite";
  return "Database";
};

const createPrismaClient = () => {
  const client = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  const provider = getDbProviderName(env.DATABASE_URL);

  // Verify database connection and log status
  client.$connect()
    .then(() => {
      console.log(`🟢 ${provider} database connected successfully!`);
    })
    .catch((err) => {
      console.error(`🔴 ${provider} database connection failed:`, err);
    });

  return client;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
