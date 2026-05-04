import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "[FitPlus] DATABASE_URL is not set.\n" +
      "  • Local dev: ensure your .env file has DATABASE_URL pointing to your Docker Postgres.\n" +
      "    Example: DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/fitplus\"\n" +
      "  • Production: set DATABASE_URL in your hosting provider's environment variables.\n" +
      "  • Run `cp .env.example .env` to create a starter .env file."
    );
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
