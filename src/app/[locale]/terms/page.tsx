import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

const sectionKeys = [
  "intro",
  "noAdvice",
  "noRelationship",
  "ip",
  "liability",
  "links",
  "law",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("title"),
    alternates: {
      canonical: locale === "ar" ? "/terms" : "/en/terms",
      languages: { ar: "/terms", en: "/en/terms" },
    },
  };
}

export default async function TermsPage({
  params,
}: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  return (
    <>
      <PageHeader title={t("title")} />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="space-y-12">
            {sectionKeys.map((key, i) => (
              <Reveal key={key} delay={Math.min(i, 3) * 60}>
                <h2 className="font-display text-2xl font-semibold text-charcoal-900">
                  {t(`sections.${key}.title`)}
                </h2>
                <p className="mt-4 leading-loose text-charcoal-600">
                  {t(`sections.${key}.text`)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
