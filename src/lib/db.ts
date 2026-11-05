import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Reuse one Prisma client per server process in every environment. On Vercel,
// prefer the pooled connection string.
const datasourceUrl = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
  });

globalForPrisma.prisma = db;
