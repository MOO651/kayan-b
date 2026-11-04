import { getTranslations, getLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { getAbout } from "@/lib/settings";

/**
 * Real, admin-managed statistics — nothing invented. Renders only when
 * the firm has filled in numbers in the dashboard.
 */
export async function StatsSection() {
  const t = await getTranslations("about");
  const locale = await getLocale();
  const about = await getAbout();

  const stats = [
    { value: about.statsYears, label: t("stats.years") },
    { value: about.statsCases, label: t("stats.cases") },
    { value: about.statsClients, label: t("stats.clients") },
    { value: about.statsTeam, label: t("stats.team") },
  ].filter((s) => s.value);

  if (stats.length === 0) return null;

  return (
    <section
      aria-label={t("stats.years")}
      className="relative overflow-hidden border-y border-brass-500/20 bg-charcoal-900 py-14"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0px, transparent 34px, rgba(198,167,107,0.5) 35px, transparent 36px)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-5 text-center lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => {
          const num = parseInt(s.value.replace(/[^\d]/g, ""), 10);
          return (
            <Reveal key={s.label} delay={i * 100}>
              <p
                className="font-display text-5xl font-bold text-brass-400"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                {Number.isFinite(num) && num > 0 ? (
                  <>
                    <AnimatedCounter value={num} />
                    {s.value.replace(/[\d\s]/g, "")}
                  </>
                ) : (
                  s.value
                )}
              </p>
              <p className="mt-2 text-sm text-ivory-100/60">{s.label}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
