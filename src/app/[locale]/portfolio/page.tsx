import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "portfolio" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "ar" ? "/portfolio" : "/en/portfolio",
      languages: { ar: "/portfolio", en: "/en/portfolio" },
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");

  const items = await db.portfolioItem.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {items.length === 0 ? (
            <Reveal className="py-16 text-center">
              <Icon
                name="briefcase"
                className="mx-auto size-16 text-brass-500/40"
                strokeWidth={1}
              />
              <p className="mt-6 text-lg text-charcoal-600">{t("empty")}</p>
            </Reveal>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => {
                const title = locale === "ar" ? item.titleAr : item.titleEn || item.titleAr;
                const summary =
                  locale === "ar" ? item.summaryAr : item.summaryEn || item.summaryAr;
                const outcome =
                  locale === "ar" ? item.outcomeAr : item.outcomeEn || item.outcomeAr;
                const tags = item.tags.split(",").map((s) => s.trim()).filter(Boolean);
                return (
                  <Reveal
                    key={item.id}
                    delay={(i % 3) * 100}
                    as="article"
                    className="group flex flex-col border border-charcoal-900/10 bg-ivory-50"
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-charcoal-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Icon name="briefcase" className="size-12 text-brass-500/30" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      {tags.length > 0 && (
                        <ul className="mb-3 flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <li
                              key={tag}
                              className="border border-brass-500/30 bg-brass-500/5 px-3 py-1 text-xs text-brass-600"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                      <h2 className="font-display text-xl font-semibold text-charcoal-900">
                        {title}
                      </h2>
                      {summary && (
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-600">
                          {summary}
                        </p>
                      )}
                      {outcome && (
                        <p className="mt-4 border-s-2 border-brass-500/50 ps-4 text-sm font-medium text-brass-600">
                          {outcome}
                        </p>
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
