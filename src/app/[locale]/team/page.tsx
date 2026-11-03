import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

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
                    <div className="relative aspect-[4/4] overflow-hidden bg-charcoal-800">
                      {lawyer.photo ? (
                        <Image
                          src={lawyer.photo}
                          alt={name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-display text-7xl font-bold text-brass-500/30">
                            {name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-7">
                      <h2 className="font-display text-2xl font-semibold text-charcoal-900">
                        {name}
                      </h2>
                      {title && (
                        <p className="mt-1 text-sm font-medium tracking-wide text-brass-600">
                          {title}
                        </p>
                      )}
                      {bio && (
                        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-charcoal-600">
                          {bio}
                        </p>
                      )}
                      {specialties.length > 0 && (
                        <div className="mt-5">
                          <p className="text-xs font-semibold tracking-wider text-charcoal-600/70 uppercase">
                            {t("specialties")}
                          </p>
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {specialties.map((s) => (
                              <li
                                key={s}
                                className="border border-brass-500/30 bg-brass-500/5 px-3 py-1 text-xs text-brass-600"
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
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
