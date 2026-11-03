import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { formatDate, cn } from "@/lib/utils";
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
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "ar" ? "/articles" : "/en/articles",
      languages: { ar: "/articles", en: "/en/articles" },
    },
  };
}

export default async function ArticlesPage({
  params,
  searchParams,
}: PageProps<"/[locale]/articles">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articles");
  const tc = await getTranslations("common");
  const { q, category } = (await searchParams) as {
    q?: string;
    category?: string;
  };

  const categories = await db.category.findMany({
    include: { _count: { select: { articles: { where: { published: true } } } } },
  });
  const activeCategories = categories.filter((c) => c._count.articles > 0);

  const query = (q ?? "").trim();
  const articles = await db.article.findMany({
    where: {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(query
        ? {
            OR: [
              { titleAr: { contains: query } },
              { titleEn: { contains: query } },
              { excerptAr: { contains: query } },
              { excerptEn: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Search + filters */}
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <form
              action=""
              method="get"
              className="relative w-full max-w-md"
              role="search"
            >
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder={t("search")}
                aria-label={t("search")}
                className="w-full border border-charcoal-900/15 bg-white/60 py-3 ps-11 pe-4 text-sm focus:border-brass-500 focus:outline-none"
              />
              <Icon
                name="search"
                className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-charcoal-600/60"
              />
            </form>

            {activeCategories.length > 0 && (
              <ul className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href={query ? `/articles?q=${encodeURIComponent(query)}` : "/articles"}
                    className={cn(
                      "inline-block border px-4 py-2 text-xs font-semibold tracking-wide transition-colors",
                      !category
                        ? "border-brass-500 bg-brass-500 text-ink-950"
                        : "border-charcoal-900/15 text-charcoal-700 hover:border-brass-500 hover:text-brass-600",
                    )}
                  >
                    {t("all")}
                  </Link>
                </li>
                {activeCategories.map((c) => {
                  const name = locale === "ar" ? c.nameAr : c.nameEn || c.nameAr;
                  const href = query
                    ? `/articles?category=${c.slug}&q=${encodeURIComponent(query)}`
                    : `/articles?category=${c.slug}`;
                  return (
                    <li key={c.id}>
                      <Link
                        href={href}
                        className={cn(
                          "inline-block border px-4 py-2 text-xs font-semibold tracking-wide transition-colors",
                          category === c.slug
                            ? "border-brass-500 bg-brass-500 text-ink-950"
                            : "border-charcoal-900/15 text-charcoal-700 hover:border-brass-500 hover:text-brass-600",
                        )}
                        aria-current={category === c.slug ? "true" : undefined}
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Reveal>

          {/* Articles grid */}
          {articles.length === 0 ? (
            <Reveal className="py-20 text-center">
              <Icon
                name="article"
                className="mx-auto size-16 text-brass-500/40"
                strokeWidth={1}
              />
              <p className="mt-6 text-lg text-charcoal-600">
                {query || category ? t("noResults") : t("empty")}
              </p>
            </Reveal>
          ) : (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => {
                const title =
                  locale === "ar"
                    ? article.titleAr
                    : article.titleEn || article.titleAr;
                const excerpt =
                  locale === "ar"
                    ? article.excerptAr
                    : article.excerptEn || article.excerptAr;
                const cat = article.category
                  ? locale === "ar"
                    ? article.category.nameAr
                    : article.category.nameEn || article.category.nameAr
                  : null;
                return (
                  <Reveal key={article.id} delay={(i % 3) * 100} as="article">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="group flex h-full flex-col border border-charcoal-900/10 bg-ivory-50 transition-all duration-500 hover:border-brass-500/50 hover:shadow-[0_20px_50px_-20px_rgba(22,24,31,0.2)]"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-charcoal-800">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                        {cat && (
                          <span className="absolute top-4 start-4 bg-ink-950/80 px-3 py-1.5 text-[0.65rem] font-semibold tracking-wider text-brass-300 uppercase backdrop-blur-sm">
                            {cat}
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
                        <h2 className="mt-3 font-display text-xl leading-snug font-semibold text-charcoal-900 transition-colors group-hover:text-brass-600">
                          {title}
                        </h2>
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
          )}
        </div>
      </section>
    </>
  );
}
