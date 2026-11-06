
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export async function PortfolioSection() {
  const t = await getTranslations("home.portfolio");
  const locale = await getLocale();

  const items = await db.portfolioItem.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 3,
  });
  if (items.length === 0) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const title =
              locale === "ar" ? item.titleAr : item.titleEn || item.titleAr;
            const summary =
              locale === "ar"
                ? item.summaryAr
                : item.summaryEn || item.summaryAr;
            return (
              <Reveal
                key={item.id}
                delay={(i % 3) * 100}
                as="article"
                className="group flex flex-col border border-charcoal-900/10 bg-ivory-50 shadow-[0_1px_2px_rgba(22,24,31,0.04)] transition-shadow duration-500 hover:shadow-[0_20px_50px_-24px_rgba(22,24,31,0.35)]"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-charcoal-800">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Icon
                        name="briefcase"
                        className="size-12 text-brass-500/30"
                        strokeWidth={1}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-semibold text-charcoal-900 transition-colors duration-500 group-hover:text-brass-600">
                    {title}
                  </h3>
                  {summary && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-600">
                      {summary}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 text-center">
          <ButtonLink href="/portfolio" variant="outline-dark" arrow>
            {t("viewAll")}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
