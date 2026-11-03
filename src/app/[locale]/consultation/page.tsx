import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "consultation" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "ar" ? "/consultation" : "/en/consultation",
      languages: { ar: "/consultation", en: "/en/consultation" },
    },
  };
}

export default async function ConsultationPage({
  params,
  searchParams,
}: PageProps<"/[locale]/consultation">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("consultation");
  const { service } = (await searchParams) as { service?: string };

  const services = await db.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const options = services.map((s) => ({
    id: s.id,
    title: locale === "ar" ? s.titleAr : s.titleEn || s.titleAr,
  }));

  const preselected = service
    ? services.find((s) => s.slug === service)?.id
    : undefined;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal className="mb-10 flex items-start gap-4 border border-brass-500/30 bg-brass-500/5 p-6">
            <Icon
              name="shield"
              className="mt-1 size-6 shrink-0 text-brass-600"
            />
            <p className="text-sm leading-relaxed text-charcoal-700">
              {t("confidential")}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <ConsultationForm
              services={options}
              preselectedService={preselected}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
