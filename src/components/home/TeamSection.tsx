import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { getHome } from "@/lib/settings";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export async function TeamSection() {
  const t = await getTranslations("home.team");
  const locale = await getLocale();
  const home = await getHome();

  if (!home.showTeam) return null;

  const lawyers = await db.lawyer.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
    take: 4,
  });

  if (lawyers.length === 0) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {lawyers.map((lawyer, i) => {
            const name =
              locale === "ar" ? lawyer.nameAr : lawyer.nameEn || lawyer.nameAr;
            const title =
              locale === "ar"
                ? lawyer.titleAr
                : lawyer.titleEn || lawyer.titleAr;
            return (
              <Reveal key={lawyer.id} delay={i * 100} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-800">
                  {lawyer.photo ? (
                    <Image
                      src={lawyer.photo}
                      alt={name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-6xl font-bold text-brass-500/30">
                        {name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/80 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-lg font-semibold text-ivory-50">
                      {name}
                    </h3>
                    {title && (
                      <p className="mt-1 text-xs tracking-wide text-brass-300">
                        {title}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 text-center">
          <ButtonLink href="/team" variant="outline-dark" arrow>
            {t("viewAll")}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
