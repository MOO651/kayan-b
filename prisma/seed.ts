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
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@makkibashmeel.com";
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
      brandNameAr: "مكي باشميل",
      brandNameEn: "Makki Bashmeel",
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

  // Seed legal categories + starter articles so public pages aren't empty
  const categories = [
    { slug: "company-law", nameAr: "قانون الشركات", nameEn: "Company Law" },
    { slug: "criminal-law", nameAr: "القانون الجنائي", nameEn: "Criminal Law" },
    { slug: "legal-tips", nameAr: "نصائح قانونية", nameEn: "Legal Tips" },
  ];

  for (const category of categories) {
    await db.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {},
    });
  }

  const articles = [
    {
      slug: "steps-to-establish-a-company-in-egypt",
      titleAr: "خطوات تأسيس شركة في مصر: دليل عملي شامل",
      titleEn: "Steps to Establish a Company in Egypt: A Practical Guide",
      excerptAr:
        "تعرف على الخطوات القانونية والوثائق المطلوبة والتكاليف المتوقعة لتأسيس شركتك في مصر من البداية حتى بدء النشاط.",
      excerptEn:
        "Learn the legal steps, required documents, and expected costs to establish your company in Egypt from scratch to launch.",
      contentAr:
        "يُعد تأسيس الشركة خطوة استراتيجية تتطلب فهماً دقيقاً للإجراءات القانونية. في هذا الدليل نستعرض أهم الخطوات:\n\n## 1. اختيار الشكل القانوني المناسب\nاختيار نوع الشركة (شركة ذات مسؤولية محدودة، شركة شخص واحدة، شركة مساهمة) يحدد المسؤولية القانونية والنظام الضريبي.\n\n## 2. حجز الاسم التجاري\nيجب التحقق من توفر الاسم وحجزه لدى السجل التجاري، مع مراعاة قواعد التسمية التجارية.\n\n## 3. إعداد عقد التأسيس\nيتضمن عقد التأسيس اسم الشركة وغرضها ورأس مالها وحصص الشركاء وحقوقهم وواجباتهم. يُفضّل مراجعة المحتوى من محامٍ متخصص لضمان حماية مصالح جميع الأطراف.\n\n## 4. التسجيل في السجل التجاري\nتقديم المستندات المطلوبة واستكمال إجراءات التسجيل والحصول على البطاقة الضريبية.\n\n## 5. التراخيص والتصاريح\nبعض الأنشطة التجارية تتطلب تراخيص خاصة من الجهات المختصة قبل بدء النشاط.\n\n## نصيحة قانونية\nاستعانةً بمحامٍ متخصص في تأسيس الشركات توفر عليك وقتاً وجهداً وتجنبك أخطاء قد تكلفك كثيراً في المستقبل.",
      contentEn:
        "Establishing a company is a strategic step that requires a precise understanding of legal procedures. In this guide we review the key steps:\n\n## 1. Choosing the Right Legal Form\nChoosing the company type (LLC, single-member company, joint-stock company) determines legal liability and the tax regime.\n\n## 2. Reserving the Trade Name\nYou must verify the availability of the name and reserve it with the Commercial Registry, observing trade naming rules.\n\n## 3. Drafting the Articles of Incorporation\nThe incorporation contract includes the company name, purpose, capital, partners' shares, rights and duties. Have a specialized lawyer review it to protect all parties.\n\n## 4. Commercial Registry Registration\nSubmit the required documents, complete registration procedures, and obtain the tax card.\n\n## 5. Licenses and Permits\nSome business activities require special licenses from the competent authorities before starting operations.\n\n## Legal Tip\nHiring a lawyer specialized in company formation saves you time and effort and avoids costly future mistakes.",
      categorySlug: "company-law",
      published: true,
    },
    {
      slug: "know-your-rights-criminal-cases",
      titleAr: "حقوقك في القضايا الجنائية: ما يجب أن تعرفه",
      titleEn: "Your Rights in Criminal Cases: What You Should Know",
      excerptAr:
        "من لحظة التحقيق حتى صدور الحكم، لكل متهم حقوق يكفلها القانون. تعرف على هذه الحقوق وكيف تحمي نفسك.",
      excerptEn:
        "From investigation to verdict, every accused person has rights guaranteed by law. Learn these rights and how to protect yourself.",
      contentAr:
        "القانون الجنائي المصري يكفل للمتهم مجموعة من الحقوق الأساسية التي يجب على كل فرد معرفتها:\n\n## حق التوكيل بمحامٍ\nمنذ اللحظة الأولى للتحقيق، يحق لك حضور محاميك في جميع جلسات الاستجواب والمواجهات، ولا يجوز إجراؤها بدونه إذا طلبته.\n\n## حق الصمت\nلك أن تمتنع عن الإجابة على الأسئلة دون تقديم مبرر، ولا يجوز استخدام الامتناع كقرينة على الإدانة.\n\n## حق معرفة التهمة\nيجب إبلاغك بالتهمة المنسوبة إليك ومساءلة التهمة التهمة بتفاصيلها منذ بداية التحقيق.\n\n## حق الطعن\nلأي حكم جنائي طعون محددة القواعد والمواعيد، ويجب استغلالها في وقتها.\n\n## متى تتواصل مع محامٍ؟\nفوراً. التأخر في الاستعانةً بمحامٍ قد يضرك حتى لو كنت بريئاً. كل كلمة تقولها دون استشارة قانونية قد تستخدم في قضيتك.",
      contentEn:
        "Egyptian criminal law guarantees the accused a set of fundamental rights that everyone should know:\n\n## Right to Counsel\nFrom the very first moment of investigation, you have the right to have your lawyer present at all interrogation and confrontation sessions.\n\n## Right to Silence\nYou may refrain from answering questions without giving a reason, and your silence cannot be used as evidence of guilt.\n\n## Right to Know the Charge\nYou must be informed of the accusation and its details from the beginning of the investigation.\n\n## Right to Appeal\nEvery criminal judgment has appeals with defined rules and deadlines that must be used in time.\n\n## When Should You Contact a Lawyer?\nImmediately. Delaying legal counsel can harm you even if you are innocent. Every word you say without legal advice may be used in your case.",
      categorySlug: "criminal-law",
      published: true,
    },
    {
      slug: "ten-tips-before-signing-any-contract",
      titleAr: "10 نصائح قبل توقيع أي عقد",
      titleEn: "10 Tips Before Signing Any Contract",
      excerptAr:
        "توقيع عقدًا دون قراءة دقيقة قد يكلفك سنوات من التقاضي. هذه أهم النقاط التي يجب مراجعتها قبل توقيع أي عقد.",
      excerptEn:
        "Signing without careful reading can cost you years of litigation. These are the key points to review before signing any contract.",
      contentAr:
        "العقد وثيقة ملزمة قانوناً، وأي بند فيه قد يتحول لاحقاً إلى التزام مالي أو قضائي. قبل أن توقع:\n\n## 1. اقرأ كل البنود\nلا توقع عقداً لم تقرأه بالكامل، حتى لو كان طويلاً أو مملّاً. البنود المدفونة هي غالباً الأكثر خطورة.\n\n## 2. تحقق من هوية الطرف الآخر\nتأكد أن من يوقع مقابل لك مفوض قانوناً بالتوقيع، وأن بياناته صحيحة.\n\n## 3. وضّح الشروط المالية\nالمبلغ ومواعيد الدفع وغرامات التأخير يجب أن تكون محددة بدقة وبدون غموض.\n\n## 4. حدّد آلية حل النزاعات\nهل اللجوء للقضاء أم التحكيم؟ وأي محاكم وأي قوانين تحكم العقد؟\n\n## 5. راجع شروط الإنهاء\nكيف ينتهي العقد؟ وماذا يحدث عند الإخلال بأي طرف؟\n\n## النصيحة الأهم\nاطلب مراجعة العقد من محامٍ قبل التوقيع. تكلفة مراجعة العقد أقل بكثير من تكلفة التقاضي عليه لاحقاً.",
      contentEn:
        "A contract is a legally binding document, and any clause in it may later turn into a financial or judicial obligation. Before you sign:\n\n## 1. Read Every Clause\nNever sign a contract you haven't read fully, even if it is long or tedious. The buried clauses are usually the most dangerous.\n\n## 2. Verify the Other Party's Identity\nMake sure the person signing against you is legally authorized, and that their details are correct.\n\n## 3. Clarify the Financial Terms\nThe amount, payment dates, and late fees must be precisely defined with no ambiguity.\n\n## 4. Define the Dispute Mechanism\nLitigation or arbitration? Which courts and which law govern the contract?\n\n## 5. Review Termination Terms\nHow does the contract end? What happens if either party breaches?\n\n## The Most Important Tip\nHave a lawyer review the contract before signing. Reviewing a contract costs far less than litigating it later.",
      categorySlug: "legal-tips",
      published: true,
    },
  ];

  for (const article of articles) {
    const { categorySlug, ...data } = article;
    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    await db.article.upsert({
      where: { slug: article.slug },
      create: {
        ...data,
        publishedAt: new Date(),
        categoryId: category?.id,
      },
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
