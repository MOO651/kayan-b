import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";
const db = new PrismaClient();
function hash(p){const s=randomBytes(16).toString("hex");return `${s}:${scryptSync(p,s,64).toString("hex")}`;}
await db.user.update({ where: { email: "qa-admin@mekkybashmeil.test" }, data: { passwordHash: hash("qa-test-pass-123") } });
console.log("reset ok");
await db.$disconnect();
