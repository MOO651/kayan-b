import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const BRAND = {
  brandNameAr: "مكي و باشميل",
  brandNameEn: "Mekky & Bashmeil",
  taglineAr: "للمحاماة والاستشارات القانونية",
  taglineEn: "Law Firm & Legal Consultancy",
  logo: "",
};

async function main() {
  const row = await db.setting.findUnique({ where: { key: "brand" } });
  let existing = {};
  try {
    existing = row ? JSON.parse(row.value) : {};
  } catch { }
  // Only update the names — preserve any logo/tagline the admin has set.
  const value = { ...existing, brandNameAr: BRAND.brandNameAr, brandNameEn: BRAND.brandNameEn };
  if (!("taglineAr" in value)) value.taglineAr = BRAND.taglineAr;
  if (!("taglineEn" in value)) value.taglineEn = BRAND.taglineEn;
  if (!("logo" in value)) value.logo = BRAND.logo;

  await db.setting.upsert({
    where: { key: "brand" },
    create: { key: "brand", value: JSON.stringify(value) },
    update: { value: JSON.stringify(value) },
  });
  console.log("brand setting updated:", JSON.stringify(value));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
