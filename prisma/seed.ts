import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const services = [
  {
    slug: "criminal-law",
    titleAr: "القانون الجنائي",
    titleEn: "Criminal Law",
    excerptAr:
      "الدفاع أمام المحاكم الجنائية والتمثيل القانوني الكامل ومتابعة القضايا الجنائية.",
    excerptEn:
      "Defense before criminal courts, full legal representation, and criminal case follow-up.",
    contentAr:
      "نقدّم خدمات الدفاع والتمثيل القانوني في القضايا الجنائية بجميع مراحلها، مع متابعة دقيقة لكل إجراءات القضية.\n\n- الدفاع أمام المحاكم الجنائية\n- التمثيل القانوني والدفاع\n- متابعة القضايا الجنائية",
    contentEn:
      "We provide defense and legal representation services in criminal cases at all stages, with meticulous follow-up of every case procedure.\n\n- Defense before criminal courts\n- Legal representation and defense\n- Criminal case follow-up",
    icon: "scale",
    order: 1,
  },
  {
    slug: "civil-litigation",
    titleAr: "التقاضي المدني",
    titleEn: "Civil Litigation",
    excerptAr:
      "التمثيل أمام المحاكم المدنية والمرافعات والتقاضي والتعامل مع مختلف أنواع المنازعات القانونية.",
    excerptEn:
      "Representation before civil courts, pleadings and litigation, and handling all types of legal disputes.",
    contentAr:
      "نمثّل عملاءنا أمام المحاكم المدنية في مختلف المنازعات القانونية، من إعداد صحف الدعاوى وحتى المرافعة وصدور الأحكام.\n\n- التمثيل أمام المحاكم المدنية\n- المرافعات والتقاضي\n- التعامل مع مختلف أنواع المنازعات القانونية",
    contentEn:
      "We represent our clients before civil courts in all types of legal disputes, from preparing statements of claim through pleadings to judgment.\n\n- Representation before civil courts\n- Pleadings and litigation\n- Handling different types of legal disputes",
    icon: "gavel",
    order: 2,
  },
  {
    slug: "company-formation",
    titleAr: "تأسيس الشركات",
    titleEn: "Company Formation",
    excerptAr:
      "تأسيس الشركات وإتمام الإجراءات القانونية وإعداد ومراجعة المستندات والوكالة والتمثيل.",
    excerptEn:
      "Company establishment, corporate legal procedures, document preparation and review, agency and representation.",
    contentAr:
      "نساعد عملاءنا في تأسيس شركاتهم وإتمام جميع الإجراءات القانونية، وإعداد ومراجعة مستندات الشركات، بالإضافة إلى خدمات الوكالة والتمثيل والتفاوض وحل النزاعات.\n\n- تأسيس الشركات\n- الإجراءات القانونية للشركات\n- إعداد ومراجعة مستندات الشركات\n- الوكالة والتمثيل\n- التفاوض وحل النزاعات",
    contentEn:
      "We help our clients establish their companies and complete all legal procedures, prepare and review company documents, in addition to agency, representation, negotiation, and dispute resolution services.\n\n- Company establishment\n- Corporate legal procedures\n- Preparing and reviewing company documents\n- Agency and representation\n- Negotiation and dispute resolution",
    icon: "building",
    order: 3,
  },
  {
    slug: "cybercrime",
    titleAr: "جرائم الإنترنت وتكنولوجيا المعلومات",
    titleEn: "Internet & Cybercrime",
    excerptAr:
      "المساعدة القانونية في الجرائم المرتبطة بالإنترنت والتمثيل القانوني ومتابعة القضايا.",
    excerptEn:
      "Legal assistance in internet-related crimes, legal representation, and case follow-up.",
    contentAr:
      "نوفر المساعدة القانونية في الجرائم المرتبطة بالإنترنت وتكنولوجيا المعلومات، مع التمثيل القانوني الكامل ومتابعة القضايا أمام الجهات المختصة.\n\n- المساعدة القانونية في الجرائم المرتبطة بالإنترنت\n- التمثيل القانوني ومتابعة القضايا",
    contentEn:
      "We provide legal assistance in internet and information technology-related crimes, with full legal representation and case follow-up before the competent authorities.\n\n- Legal assistance in internet-related crimes\n- Legal representation and case follow-up",
    icon: "shield",
    order: 4,
  },
  {
    slug: "contract-drafting",
    titleAr: "صياغة العقود",
    titleEn: "Contract Drafting",
    excerptAr:
      "صياغة الاتفاقيات القانونية ومراجعة العقود وحماية المصالح القانونية للعملاء بشروط واضحة.",
    excerptEn:
      "Drafting legal agreements, reviewing contracts, and protecting clients' legal interests with clear terms.",
    contentAr:
      "نصيغ العقود والاتفاقيات القانونية بعناية فائقة، ونراجع العقود القائمة، بهدف حماية المصالح القانونية لعملائنا وضمان وضوح الشروط التعاقدية.\n\n- صياغة الاتفاقيات القانونية\n- مراجعة العقود\n- حماية المصالح القانونية للعملاء\n- شروط تعاقدية واضحة",
    contentEn:
      "We draft contracts and legal agreements with utmost care and review existing contracts, aiming to protect our clients' legal interests and ensure clear contractual terms.\n\n- Drafting legal agreements\n- Reviewing contracts\n- Protecting the legal interests of clients\n- Clear contractual terms",
    icon: "file-text",
    order: 5,
  },
  {
    slug: "arbitration",
    titleAr: "التحكيم وتسوية المنازعات",
    titleEn: "Arbitration & Dispute Resolution",
    excerptAr:
      "التمثيل في إجراءات التحكيم وتسوية المنازعات والتفاوض وحل النزاعات التجارية.",
    excerptEn:
      "Representation in arbitration proceedings, dispute settlement, negotiation, and commercial dispute resolution.",
    contentAr:
      "نمثّل عملاءنا في إجراءات التحكيم المحلية والدولية، ونساعد في تسوية المنازعات بالتفاوض والطرق البديلة، مع تقديم المساعدة القانونية في حل النزاعات التجارية.\n\n- التمثيل في إجراءات التحكيم\n- تسوية المنازعات\n- التفاوض\n- المساعدة القانونية في حل النزاعات التجارية",
    contentEn:
      "We represent our clients in local and international arbitration proceedings, assist in settling disputes through negotiation and alternative methods, and provide legal assistance in resolving commercial disputes.\n\n- Representation in arbitration proceedings\n- Dispute settlement\n- Negotiation\n- Legal assistance in resolving commercial disputes",
    icon: "handshake",
    order: 6,
  },
  {
    slug: "foreign-investment",
    titleAr: "الاستثمار الأجنبي",
    titleEn: "Foreign Investment",
    excerptAr:
      "الدعم القانوني للمستثمرين المحليين والأجانب وتأسيس المشروعات الاستثمارية في مصر.",
    excerptEn:
      "Legal support for local and foreign investors and establishing investment projects in Egypt.",
    contentAr:
      "نقدّم الدعم القانوني للمستثمرين المحليين والأجانب، بدءاً من تأسيس المشروعات الاستثمارية وحتى إدارة جميع الإجراءات القانونية المتعلقة بالاستثمارات في مصر.\n\n- الدعم القانوني للمستثمرين المحليين والأجانب\n- تأسيس المشروعات الاستثمارية\n- إدارة الإجراءات القانونية المتعلقة بالاستثمارات في مصر",
    contentEn:
      "We provide legal support for local and foreign investors, from establishing investment projects to managing all legal procedures related to investments in Egypt.\n\n- Legal support for local and foreign investors\n- Establishing investment projects\n- Managing legal procedures related to investments in Egypt",
    icon: "globe",
    order: 7,
  },
  {
    slug: "trademarks-ip",
    titleAr: "العلامات التجارية والملكية الفكرية",
    titleEn: "Trademarks & Intellectual Property",
    excerptAr:
      "إجراءات تسجيل العلامات التجارية ومراقبتها وحمايتها والدفاع عن حقوق مالكيها.",
    excerptEn:
      "Trademark registration procedures, monitoring and protection, and defending trademark owners' rights.",
    contentAr:
      "نتولى إجراءات تسجيل العلامات التجارية، ونراقب العلامات المسجلة لحمايتها من التعدي، وندافع عن حقوق مالكي العلامات التجارية والملكية الفكرية.\n\n- إجراءات تسجيل العلامات التجارية\n- مراقبة وحماية العلامات التجارية\n- الدفاع عن حقوق مالكي العلامات التجارية",
    contentEn:
      "We handle trademark registration procedures, monitor registered trademarks to protect them from infringement, and defend the rights of trademark and intellectual property owners.\n\n- Trademark registration procedures\n- Monitoring and protecting trademarks\n- Defending trademark owners' rights",
    icon: "award",
    order: 8,
  },
];

async function main() {
  // Default admin account — change the password after first login.
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@kayanbashmeel.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";

  await db.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "مدير الموقع",
      passwordHash: hashPassword(adminPassword),
      role: "ADMIN",
    },
    update: {},
  });

  for (const service of services) {
    await db.service.upsert({
      where: { slug: service.slug },
      create: service,
      update: service,
    });
  }

  const settings: Record<string, unknown> = {
    brand: {
      brandNameAr: "كيان باشميل",
      brandNameEn: "Kayan Bashmeel",
      taglineAr: "للمحاماة والاستشارات القانونية",
      taglineEn: "Law Firm & Legal Consultancy",
      logo: "",
    },
    contact: {
      phone: "",
      email: "",
      whatsapp: "",
      addressAr: "",
      addressEn: "",
      mapEmbedUrl: "",
    },
    social: { facebook: "", twitter: "", linkedin: "", instagram: "" },
    home: {
      heroImage: "",
      heroTitleAr: "",
      heroTitleEn: "",
      heroSubtitleAr: "",
      heroSubtitleEn: "",
      aboutImage: "",
      showTeam: true,
      showArticles: true,
    },
  };

  for (const [key, value] of Object.entries(settings)) {
    await db.setting.upsert({
      where: { key },
      create: { key, value: JSON.stringify(value) },
      update: {},
    });
  }

  console.log("Seed completed.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  console.log("IMPORTANT: change the admin password after first login.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
