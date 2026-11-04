/**
 * Runs on Vercel builds: aligns the Prisma provider with DATABASE_URL,
 * pushes the schema and seeds the database (idempotent — safe to run on
 * every deploy).
 *
 * Local development uses SQLite (file:./dev.db). Production uses Postgres
 * (e.g. Neon/Vercel Postgres). The provider cannot be read from an env var
 * in schema.prisma, so we rewrite it here before generating the client —
 * the generated client must match the datasource provider.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const url = process.env.DATABASE_URL ?? "";
if (!url) {
  console.log("DATABASE_URL not set — skipping database setup.");
  process.exit(0);
}

const isSqlite = url.startsWith("file:");
const desired = isSqlite ? "sqlite" : "postgresql";
const schemaPath = "prisma/schema.prisma";

try {
  let schema = readFileSync(schemaPath, "utf8");
  if (!new RegExp(`provider\\s*=\\s*"${desired}"`).test(schema)) {
    console.log(`Switching Prisma provider to "${desired}"…`);
    schema = schema.replace(
      /provider\s*=\s*"(?:sqlite|postgresql)"/,
      `provider = "${desired}"`,
    );
    writeFileSync(schemaPath, schema);
  }

  console.log("Generating Prisma Client…");
  execSync("npx prisma generate", { stdio: "inherit" });

  console.log("Pushing Prisma schema…");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });

  console.log("Seeding database…");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });

  console.log("Database ready.");
} catch (error) {
  console.error("Database setup failed:", error);
  process.exit(1);
}
