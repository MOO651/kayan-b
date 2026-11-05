import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

export async function VenturesSection() {
  const t = await getTranslations("ventures");
  const locale = await getLocale();

  const ventures = await db.externalVenture.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  if (ventures.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #c8a25a 0, transparent 45%), radial-gradient(circle at 75% 75%, #c8a25a 0, transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
          dark
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ventures.map((venture, i) => {
            const name =
              locale === "ar"
                ? venture.nameAr
                : venture.nameEn || venture.nameAr;
            const desc =
              locale === "ar"
                ? venture.descAr
                : venture.descEn || venture.descAr;
            return (
              <Reveal key={venture.id} delay={(i % 3) * 100}>
                <a
                  href={venture.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col border border-ivory-50/10 bg-charcoal-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-brass-500/50 hover:shadow-xl hover:shadow-brass-500/5"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-charcoal-800">
                    {venture.image ? (
                      <Image
                        src={venture.image}
                        alt={name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 30% 30%, rgba(200,162,90,0.25) 0, transparent 60%)",
                        }}
                      />
                    )}
                    {venture.logo && (
                      <div className="absolute bottom-3 start-3 flex size-14 items-center justify-center overflow-hidden border border-ivory-50/15 bg-ink-950/90 p-2 backdrop-blur">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={venture.logo}
                          alt={`${name} logo`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-semibold text-ivory-50 transition-colors group-hover:text-brass-300">
                      {name}
                    </h3>
                    {desc && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ivory-100/60">
                        {desc}
                      </p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brass-400">
                      {t("visit")}
                      <Icon
                        name="arrow"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
