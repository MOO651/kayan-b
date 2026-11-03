import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "ar" ? "/services" : "/en/services",
      languages: { ar: "/services", en: "/en/services" },
    },
  };
}

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const services = await db.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const title =
                locale === "ar"
                  ? service.titleAr
                  : service.titleEn || service.titleAr;
              const excerpt =
                locale === "ar"
                  ? service.excerptAr
                  : service.excerptEn || service.excerptAr;
              return (
                <Reveal key={service.id} delay={(i % 3) * 100}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col border border-charcoal-900/10 bg-ivory-50 p-8 transition-all duration-500 hover:border-brass-500/50 hover:shadow-[0_20px_50px_-20px_rgba(22,24,31,0.2)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex size-14 items-center justify-center border border-brass-500/30 text-brass-600 transition-colors duration-500 group-hover:bg-brass-500 group-hover:text-ink-950">
                        <Icon
                          name={service.icon || "scale"}
                          className="size-7"
                        />
                      </span>
                      <span className="font-display text-4xl font-bold text-charcoal-900/10 transition-colors duration-500 group-hover:text-brass-500/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="mt-7 font-display text-2xl font-semibold text-charcoal-900">
                      {title}
                    </h2>
                    <p className="mt-3 flex-1 leading-relaxed text-charcoal-600">
                      {excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brass-600 uppercase">
                      {t("consultCta")}
                      <Icon
                        name="arrow-left"
                        className="size-4 transition-transform duration-300 group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
