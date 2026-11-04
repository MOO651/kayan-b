const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function fix(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(fix);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === "string"
      ? v.replace(/كيان باشميل/g, "مكي باشميل").replace(/Kayan Bashmeel/g, "Makki Bashmeel")
      : await fix(v);
  }
  return out;
}

(async () => {
  const rows = await p.setting.findMany();
  for (const r of rows) {
    let v;
    try { v = JSON.parse(r.value); } catch { continue; }
    const fixed = await fix(v);
    const ns = JSON.stringify(fixed);
    if (ns !== r.value) {
      await p.setting.update({ where: { key: r.key }, data: { value: ns } });
      console.log("updated:", r.key);
    }
  }
  await p.$disconnect();
  console.log("done");
})();
