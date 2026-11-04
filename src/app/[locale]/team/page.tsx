import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { TeamCard } from "@/components/ui/TeamCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "ar" ? "/team" : "/en/team",
      languages: { ar: "/team", en: "/en/team" },
    },
  };
}

export default async function TeamPage({
  params,
}: PageProps<"/[locale]/team">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");

  const lawyers = await db.lawyer.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {lawyers.length === 0 ? (
            <Reveal className="py-16 text-center">
              <Icon
                name="users"
                className="mx-auto size-16 text-brass-500/40"
                strokeWidth={1}
              />
              <p className="mt-6 text-lg text-charcoal-600">{t("empty")}</p>
            </Reveal>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {lawyers.map((lawyer, i) => {
                const name =
                  locale === "ar"
                    ? lawyer.nameAr
                    : lawyer.nameEn || lawyer.nameAr;
                const title =
                  locale === "ar"
                    ? lawyer.titleAr
                    : lawyer.titleEn || lawyer.titleAr;
                const bio =
                  locale === "ar" ? lawyer.bioAr : lawyer.bioEn || lawyer.bioAr;
                const specialties = lawyer.specialties
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                return (
                  <Reveal
                    key={lawyer.id}
                    delay={(i % 3) * 100}
                    as="article"
                    className="group border border-charcoal-900/10 bg-ivory-50"
                  >
                    <TeamCard
                      lawyer={{
                        id: lawyer.id,
                        slug: lawyer.slug,
                        name,
                        title,
                        bio,
                        photo: lawyer.photo,
                        specialties,
                      }}
                      locale={locale}
                      specialtiesLabel={t("specialties")}
                      viewProfileLabel={t("viewProfile")}
                    />
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
