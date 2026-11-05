/**
 * Build-time Prisma client generation only.
 * Database schema changes must be applied as an explicit, reviewed operation;
 * never run db push --accept-data-loss or seed production data during a build.
 */
import { execSync } from "node:child_process";

execSync("npx prisma generate", { stdio: "inherit" });
