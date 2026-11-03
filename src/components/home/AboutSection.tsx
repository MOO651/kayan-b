import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getHome } from "@/lib/settings";

export async function AboutSection() {
  const t = await getTranslations("home.about");
  const home = await getHome();

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-900">
              {home.aboutImage ? (
                <Image
                  src={home.aboutImage}
                  alt={t("title")}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent 0px, transparent 34px, rgba(198,167,107,0.5) 35px, transparent 36px)",
                    }}
                  />
                  <Icon
                    name="scale"
                    className="size-24 text-brass-500/60"
                    strokeWidth={1}
                  />
                </div>
              )}
            </div>
            {/* Frame accent */}
            <div
              aria-hidden
              className="absolute -top-4 -end-4 -z-10 h-full w-full border border-brass-500/50"
            />
          </Reveal>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-brass-600 uppercase">
                <span className="inline-block h-px w-8 bg-current" aria-hidden />
                {t("kicker")}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-snug font-semibold text-balance text-charcoal-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.25]">
                {t("title")}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-charcoal-600">
                {t("text")}
              </p>
            </Reveal>

            <div className="mt-10 space-y-6 border-s-2 border-brass-500/40 ps-6">
              <Reveal delay={100}>
                <h3 className="font-display text-xl font-semibold text-charcoal-900">
                  {t("philosophyTitle")}
                </h3>
                <p className="mt-2 leading-relaxed text-charcoal-600">
                  {t("philosophy")}
                </p>
              </Reveal>
              <Reveal delay={200}>
                <h3 className="font-display text-xl font-semibold text-charcoal-900">
                  {t("missionTitle")}
                </h3>
                <p className="mt-2 leading-relaxed text-charcoal-600">
                  {t("mission")}
                </p>
              </Reveal>
            </div>

            <Reveal delay={300} className="mt-10">
              <ButtonLink href="/about" variant="outline-dark" arrow>
                {t("link")}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
