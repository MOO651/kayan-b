/**
 * Build-time Prisma client generation only.
 * Keep the generated client aligned with the production datasource provider.
 * Schema changes are explicit reviewed operations, never destructive build steps.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const url = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL || "";
if (!url) {
  console.log("No database URL configured; generating the default Prisma client.");
} else {
  const provider = url.startsWith("file:") ? "sqlite" : "postgresql";
  const schemaPath = "prisma/schema.prisma";
  const schema = readFileSync(schemaPath, "utf8");
  const updated = schema.replace(
    /provider\s*=\s*"(?:sqlite|postgresql)"/,
    'provider = "' + provider + '"',
  );
  if (updated !== schema) writeFileSync(schemaPath, updated);
}

execSync("npx prisma generate", { stdio: "inherit" });
