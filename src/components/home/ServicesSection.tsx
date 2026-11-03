import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export async function ServicesSection() {
  const t = await getTranslations("home.services");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const services = await db.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  if (services.length === 0) return null;

  return (
    <section className="bg-ivory-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-charcoal-900/10 bg-charcoal-900/10 sm:grid-cols-2 lg:grid-cols-4">
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
              <Reveal
                key={service.id}
                delay={(i % 4) * 80}
                className="group relative bg-ivory-50"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="flex h-full flex-col p-8 transition-colors duration-500 group-hover:bg-charcoal-900"
                >
                  <span className="text-xs font-semibold tracking-widest text-brass-600/60 transition-colors duration-500 group-hover:text-brass-400/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-6 flex size-12 items-center justify-center border border-brass-500/30 text-brass-600 transition-all duration-500 group-hover:border-brass-400/50 group-hover:text-brass-300">
                    <Icon name={service.icon || "scale"} className="size-6" />
                  </span>
                  <h3 className="mt-6 font-display text-xl leading-snug font-semibold text-charcoal-900 transition-colors duration-500 group-hover:text-ivory-50">
                    {title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-600 transition-colors duration-500 group-hover:text-ivory-100/70">
                    {excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brass-600 uppercase transition-colors duration-500 group-hover:text-brass-300">
                    {tc("details")}
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

        <Reveal className="mt-12 text-center">
          <ButtonLink href="/services" variant="outline-dark" arrow>
            {t("viewAll")}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
