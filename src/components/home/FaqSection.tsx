import { getTranslations, getLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FaqSectionClient, type FaqItem } from "./FaqSectionClient";

export async function FaqSection() {
  const t = await getTranslations("home.faq");
  const locale = await getLocale();

  const rows = await db.faq.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 8,
  });
  if (rows.length === 0) return null;

  const items: FaqItem[] = rows.map((row) => ({
    id: row.id,
    question: locale === "ar" ? row.questionAr : row.questionEn || row.questionAr,
    answer: locale === "ar" ? row.answerAr : row.answerEn || row.answerAr,
  }));

  // JSON-LD for Google rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="py-24 lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker={t("kicker")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
        </Reveal>
        <Reveal delay={100}>
          <FaqSectionClient items={items} />
        </Reveal>
      </div>
    </section>
  );
}
