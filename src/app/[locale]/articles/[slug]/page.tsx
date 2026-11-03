import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { getBrand } from "@/lib/settings";
import { Reveal } from "@/components/ui/Reveal";
import { RichContent } from "@/components/ui/RichContent";
import { Icon } from "@/components/ui/Icon";

type Params = { locale: string; slug: string };

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  return db.article.findFirst({
    where: { slug, published: true },
    include: { category: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const title =
    locale === "ar"
      ? article.seoTitleAr || article.titleAr
      : article.seoTitleEn || article.titleEn || article.titleAr;
  const description =
    locale === "ar"
      ? article.seoDescAr || article.excerptAr
      : article.seoDescEn || article.excerptEn || article.excerptAr;
  const path = `/articles/${article.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: locale === "ar" ? path : `/en${path}`,
      languages: { ar: path, en: `/en${path}` },
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: article.image || undefined,
      publishedTime: article.publishedAt?.toISOString(),
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: PageProps<"/[locale]/articles/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articles");

  const article = await getArticle(slug);
  if (!article) notFound();

  const brand = await getBrand();
  const title =
    locale === "ar" ? article.titleAr : article.titleEn || article.titleAr;
  const content =
    locale === "ar"
      ? article.contentAr
      : article.contentEn || article.contentAr;
  const category = article.category
    ? locale === "ar"
      ? article.category.nameAr
      : article.category.nameEn || article.category.nameAr
    : null;

  const related = await db.article.findMany({
    where: {
      published: true,
      id: { not: article.id },
      ...(article.categoryId ? { categoryId: article.categoryId } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description:
      locale === "ar" ? article.excerptAr : article.excerptEn || article.excerptAr,
    image: article.image ? `${siteUrl}${article.image}` : undefined,
    datePublished: article.publishedAt?.toISOString(),
    inLanguage: locale === "ar" ? "ar" : "en",
    author: {
      "@type": "Organization",
      name: locale === "ar" ? brand.brandNameAr : brand.brandNameEn,
    },
    publisher: {
      "@type": "Organization",
      name: locale === "ar" ? brand.brandNameAr : brand.brandNameEn,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-ink-950 pt-40 pb-20 lg:pt-48 lg:pb-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(176,141,87,0.15),transparent)]"
        />
        <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
          <Reveal>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brass-400 uppercase transition-colors hover:text-brass-300"
            >
              <Icon name="arrow-left" className="size-4 ltr:rotate-180" />
              {t("backToArticles")}
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs tracking-wide text-ivory-100/60">
              {category && (
                <span className="border border-brass-400/40 px-3 py-1 font-semibold text-brass-300 uppercase">
                  {category}
                </span>
              )}
              {article.publishedAt && (
                <time dateTime={article.publishedAt.toISOString()}>
                  {t("publishedAt")}: {formatDate(article.publishedAt, locale)}
                </time>
              )}
            </div>
            <h1 className="mt-6 font-display text-4xl leading-snug font-bold text-balance text-ivory-50 sm:text-5xl">
              {title}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          {article.image && (
            <Reveal className="relative mb-12 aspect-[16/8] overflow-hidden bg-charcoal-900">
              <Image
                src={article.image}
                alt={title}
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
            </Reveal>
          )}
          <Reveal>
            <RichContent
              content={content}
              className="text-lg text-charcoal-700"
            />
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-ivory-100 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-charcoal-900">
                {t("related")}
              </h2>
              <span
                aria-hidden
                className="mt-6 block h-px w-24 bg-brass-500"
              />
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => {
                const itemTitle =
                  locale === "ar"
                    ? item.titleAr
                    : item.titleEn || item.titleAr;
                return (
                  <Reveal key={item.id} delay={i * 100}>
                    <Link
                      href={`/articles/${item.slug}`}
                      className="group flex h-full flex-col border border-charcoal-900/10 bg-ivory-50 p-7 transition-all duration-500 hover:border-brass-500/50"
                    >
                      {item.publishedAt && (
                        <time
                          dateTime={item.publishedAt.toISOString()}
                          className="text-xs tracking-wide text-charcoal-600/70"
                        >
                          {formatDate(item.publishedAt, locale)}
                        </time>
                      )}
                      <h3 className="mt-3 font-display text-xl leading-snug font-semibold text-charcoal-900 transition-colors group-hover:text-brass-600">
                        {itemTitle}
                      </h3>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
