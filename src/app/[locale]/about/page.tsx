import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getAbout } from "@/lib/settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "ar" ? "/about" : "/en/about",
      languages: { ar: "/about", en: "/en/about" },
    },
  };
}

const valueKeys = [
  { key: "integrity", icon: "scale" },
  { key: "precision", icon: "target" },
  { key: "confidentiality", icon: "shield" },
  { key: "commitment", icon: "handshake" },
] as const;

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const about = await getAbout();

  // Admin-managed content takes precedence; fall back to translation strings.
  const intro = (locale === "ar" ? about.introAr : about.introEn || about.introAr) || t("intro");
  const vision = (locale === "ar" ? about.visionAr : about.visionEn || about.visionAr) || t("philosophy");
  const mission = (locale === "ar" ? about.missionAr : about.missionEn || about.missionAr) || t("mission");
  const values = (locale === "ar" ? about.valuesAr : about.valuesEn || about.valuesAr);
  const history = (locale === "ar" ? about.historyAr : about.historyEn || about.historyAr);

  const stats = [
    { value: about.statsYears, label: t("stats.years") },
    { value: about.statsCases, label: t("stats.cases") },
    { value: about.statsClients, label: t("stats.clients") },
    { value: about.statsTeam, label: t("stats.team") },
  ].filter((s) => s.value);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {stats.length > 0 && (
        <section aria-label="أرقام المكتب" className="border-b border-charcoal-900/10 bg-ivory-100 py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-5 text-center lg:grid-cols-4 lg:px-8">
            {stats.map((s) => (
              <Reveal key={s.label}>
                <p className="font-display text-4xl font-bold text-brass-600" dir="ltr">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-charcoal-600">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-charcoal-900">
              {t("introTitle")}
            </h2>
            <p className="mt-6 text-lg leading-loose text-charcoal-600">
              {intro}
            </p>
          </Reveal>

          <div className="mt-16 grid gap-10 border-s-2 border-brass-500/40 ps-8">
            <Reveal>
              <h3 className="font-display text-2xl font-semibold text-charcoal-900">
                {t("philosophyTitle")}
              </h3>
              <p className="mt-3 leading-loose text-charcoal-600">
                {vision}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="font-display text-2xl font-semibold text-charcoal-900">
                {t("missionTitle")}
              </h3>
              <p className="mt-3 leading-loose text-charcoal-600">
                {mission}
              </p>
            </Reveal>
            {history && (
              <Reveal delay={200}>
                <h3 className="font-display text-2xl font-semibold text-charcoal-900">
                  {t("historyTitle")}
                </h3>
                <p className="mt-3 leading-loose text-charcoal-600">
                  {history}
                </p>
              </Reveal>
            )}
            {values && (
              <Reveal delay={300}>
                <h3 className="font-display text-2xl font-semibold text-charcoal-900">
                  {t("valuesTitle")}
                </h3>
                <p className="mt-3 leading-loose text-charcoal-600">
                  {values}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="bg-ivory-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
              {t("valuesTitle")}
            </h2>
            <span
              aria-hidden
              className="mx-auto mt-6 block h-px w-24 bg-brass-500"
            />
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden border border-charcoal-900/10 bg-charcoal-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {valueKeys.map(({ key, icon }, i) => (
              <Reveal
                key={key}
                delay={i * 100}
                className="group bg-ivory-50 p-8 transition-colors duration-500 hover:bg-charcoal-900"
              >
                <span className="flex size-12 items-center justify-center border border-brass-500/30 text-brass-600 transition-colors duration-500 group-hover:border-brass-400/50 group-hover:text-brass-300">
                  <Icon name={icon} className="size-6" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-charcoal-900 transition-colors duration-500 group-hover:text-ivory-50">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600 transition-colors duration-500 group-hover:text-ivory-100/70">
                  {t(`values.${key}.text`)}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 text-center">
            <ButtonLink href="/contact" arrow>
              {t("cta")}
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
