import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { getHome } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export async function ArticlesSection() {
  const t = await getTranslations("home.articles");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const home = await getHome();

  if (!home.showArticles) return null;

  const articles = await db.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });

  if (articles.length === 0) return null;

  return (
    <section className="bg-ivory-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {articles.map((article, i) => {
            const title =
              locale === "ar"
                ? article.titleAr
                : article.titleEn || article.titleAr;
            const excerpt =
              locale === "ar"
                ? article.excerptAr
                : article.excerptEn || article.excerptAr;
            const category = article.category
              ? locale === "ar"
                ? article.category.nameAr
                : article.category.nameEn || article.category.nameAr
              : null;
            return (
              <Reveal key={article.id} delay={i * 100} as="article">
                <Link
                  href={`/articles/${article.slug}`}
                  className="group flex h-full flex-col bg-ivory-50 transition-shadow duration-500 hover:shadow-[0_20px_50px_-20px_rgba(22,24,31,0.25)]"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-charcoal-800">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Icon
                          name="article"
                          className="size-14 text-brass-500/50"
                          strokeWidth={1}
                        />
                      </div>
                    )}
                    {category && (
                      <span className="absolute top-4 start-4 bg-ink-950/80 px-3 py-1.5 text-[0.65rem] font-semibold tracking-wider text-brass-300 uppercase backdrop-blur-sm">
                        {category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    {article.publishedAt && (
                      <time
                        dateTime={article.publishedAt.toISOString()}
                        className="text-xs tracking-wide text-charcoal-600/70"
                      >
                        {formatDate(article.publishedAt, locale)}
                      </time>
                    )}
                    <h3 className="mt-3 font-display text-xl leading-snug font-semibold text-charcoal-900 transition-colors group-hover:text-brass-600">
                      {title}
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-charcoal-600">
                      {excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brass-600 uppercase">
                      {tc("readMore")}
                      <Icon
                        name="arrow-left"
                        className="size-4 transition-transform duration-300 group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 text-center">
          <ButtonLink href="/articles" variant="outline-dark" arrow>
            {t("viewAll")}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
