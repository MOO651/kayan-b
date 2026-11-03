import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

const items = [
  { key: "professionalism", icon: "briefcase" },
  { key: "confidentiality", icon: "shield" },
  { key: "clientFocus", icon: "users" },
  { key: "research", icon: "search" },
  { key: "strategy", icon: "target" },
] as const;

export async function WhySection() {
  const t = await getTranslations("home.why");

  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-24 lg:py-32">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 118px, rgba(250,248,242,0.7) 119px, transparent 120px)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading dark kicker={t("kicker")} title={t("title")} />

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {items.map(({ key, icon }, i) => (
            <Reveal
              key={key}
              delay={i * 100}
              className="group border-t border-ivory-50/10 pt-8 transition-colors duration-500 hover:border-brass-400/60"
            >
              <span className="flex size-12 items-center justify-center text-brass-400 transition-transform duration-500 group-hover:-translate-y-1">
                <Icon name={icon} className="size-8" strokeWidth={1.25} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ivory-50">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory-100/60">
                {t(`items.${key}.text`)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
