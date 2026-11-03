import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { RichContent } from "@/components/ui/RichContent";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Params = { locale: string; slug: string };

export const dynamic = "force-dynamic";

async function getService(slug: string) {
  return db.service.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  const title = locale === "ar" ? service.titleAr : service.titleEn || service.titleAr;
  const description =
    locale === "ar" ? service.excerptAr : service.excerptEn || service.excerptAr;
  const path = `/services/${service.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: locale === "ar" ? path : `/en${path}`,
      languages: { ar: path, en: `/en${path}` },
    },
    openGraph: { title, description, images: service.image || undefined },
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const service = await getService(slug);
  if (!service) notFound();

  const title = locale === "ar" ? service.titleAr : service.titleEn || service.titleAr;
  const content =
    locale === "ar" ? service.contentAr : service.contentEn || service.contentAr;

  const related = await db.service.findMany({
    where: { published: true, id: { not: service.id } },
    orderBy: { order: "asc" },
    take: 3,
  });

  return (
    <>
      <PageHeader title={title} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-3 lg:gap-20">
            <Reveal className="lg:col-span-2">
              {service.image && (
                <div className="relative mb-10 aspect-[16/8] overflow-hidden bg-charcoal-900">
                  <Image
                    src={service.image}
                    alt={title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center border border-brass-500/30 text-brass-600">
                  <Icon name={service.icon || "scale"} className="size-7" />
                </span>
                <span className="h-px flex-1 bg-charcoal-900/10" aria-hidden />
              </div>
              <RichContent
                content={content}
                className="mt-8 text-lg text-charcoal-700"
              />
              <div className="mt-12 border border-brass-500/30 bg-brass-500/5 p-8">
                <h2 className="font-display text-2xl font-semibold text-charcoal-900">
                  {t("consultCta")}
                </h2>
                <div className="mt-6">
                  <ButtonLink
                    href={`/consultation?service=${service.slug}`}
                    arrow
                  >
                    {t("consultCta")}
                  </ButtonLink>
                </div>
              </div>
            </Reveal>

            <aside className="lg:col-span-1">
              <Reveal delay={150}>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-brass-600 uppercase">
                  {t("related")}
                </h2>
                <ul className="mt-6 divide-y divide-charcoal-900/10 border-y border-charcoal-900/10">
                  {related.map((item) => {
                    const itemTitle =
                      locale === "ar"
                        ? item.titleAr
                        : item.titleEn || item.titleAr;
                    return (
                      <li key={item.id}>
                        <Link
                          href={`/services/${item.slug}`}
                          className="group flex items-center justify-between gap-4 py-4 transition-colors"
                        >
                          <span className="flex items-center gap-3 font-medium text-charcoal-800 transition-colors group-hover:text-brass-600">
                            <Icon
                              name={item.icon || "scale"}
                              className="size-5 text-brass-600"
                            />
                            {itemTitle}
                          </span>
                          <Icon
                            name="arrow-left"
                            className="size-4 text-charcoal-600/50 transition-all group-hover:-translate-x-1 group-hover:text-brass-600 ltr:rotate-180 ltr:group-hover:translate-x-1"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-8">
                  <ButtonLink href="/services" variant="outline-dark">
                    {t("backToServices")}
                  </ButtonLink>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
