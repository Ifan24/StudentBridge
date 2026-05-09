import { PrismaClient, type Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prismaOptions: Prisma.PrismaClientOptions | undefined =
  process.env.DEBUG_PRISMA === "true"
    ? { log: ["query", "info", "warn", "error"] }
    : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function logServerFallback(message: string, error: unknown) {
  if (process.env.DEBUG_STUDENTBRIDGE_FALLBACKS === "true") {
    console.warn(message, error);
  }
}
