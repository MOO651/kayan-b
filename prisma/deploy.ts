/**
 * Runs on Vercel builds: pushes the Prisma schema to the production
 * Postgres database and seeds it (idempotent — safe to run on every deploy).
 */
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL not set — skipping database setup.");
  process.exit(0);
}

try {
  console.log("Pushing Prisma schema…");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
  console.log("Seeding database…");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  console.log("Database ready.");
} catch (error) {
  console.error("Database setup failed:", error);
  process.exit(1);
}
