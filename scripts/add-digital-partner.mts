import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const existing = await db.lawyer.findFirst({ where: { category: "DIGITAL" } });
if (existing) {
  await db.lawyer.update({
    where: { id: existing.id },
    data: {
      nameAr: "محمد",
      nameEn: "Mohamed",
      titleAr: "شريك التطوير والحلول الرقمية",
      titleEn: "Software Developer & Digital Solutions Partner",
      bioAr:
        "متخصص في تطوير المواقع والأنظمة والحلول الرقمية، وعملت على بناء منصات رقمية متكاملة للمكتب ومشاريعه، من المواقع التعريفية إلى أنظمة إدارة المحتوى والطلبات.",
      bioEn:
        "Specialized in developing websites, systems, and digital solutions. Built integrated digital platforms for the firm and its ventures, from corporate websites to content and request management systems.",
      category: "DIGITAL",
      role: "DIGITAL",
      visible: true,
    },
  });
  console.log("UPDATED:", existing.id);
}

await db.$disconnect();
