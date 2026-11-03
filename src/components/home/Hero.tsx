import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { getHome, getBrand } from "@/lib/settings";

export async function Hero() {
  const t = await getTranslations("hero");
  const locale = await getLocale();
  const [home, brand] = await Promise.all([getHome(), getBrand()]);

  const title =
    (locale === "ar" ? home.heroTitleAr : home.heroTitleEn) || t("title");
  const subtitle =
    (locale === "ar" ? home.heroSubtitleAr : home.heroSubtitleEn) ||
    t("subtitle");

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-ink-950">
      {/* Background */}
      {home.heroImage ? (
        <Image
          src={home.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="ken-burns object-cover opacity-40"
        />
      ) : (
        <DefaultBackdrop />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/40 to-ink-950"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(176,141,87,0.12),transparent)]"
      />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="page-enter flex items-center gap-4 text-xs font-semibold tracking-[0.3em] text-brass-400 uppercase">
            <span className="inline-block h-px w-12 bg-brass-500" aria-hidden />
            {t("kicker")}
          </p>
          <h1
            className="page-enter mt-6 font-display text-5xl leading-[1.15] font-bold text-ivory-50 text-balance sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            {title}
            <span className="mt-2 block text-2xl font-medium tracking-[0.15em] text-brass-300 uppercase sm:text-3xl">
              {locale === "ar" ? brand.taglineAr : brand.taglineEn}
            </span>
          </h1>
          <p
            className="page-enter mt-8 max-w-2xl text-lg leading-relaxed text-ivory-100/80"
            style={{ animationDelay: "240ms" }}
          >
            {subtitle}
          </p>
          <div
            className="page-enter mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "360ms" }}
          >
            <ButtonLink href="/consultation" arrow>
              {t("cta")}
            </ButtonLink>
            <ButtonLink href="/about" variant="outline-light">
              {t("secondary")}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-ivory-100/50">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase">
            {t("scroll")}
          </span>
          <span className="block h-10 w-px overflow-hidden bg-ivory-50/20">
            <span className="block h-4 w-px animate-bounce bg-brass-400" />
          </span>
        </div>
      </div>
    </section>
  );
}

function DefaultBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0">
      {/* Architectural column hairlines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 118px, rgba(250,248,242,0.6) 119px, transparent 120px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 118px, rgba(250,248,242,0.5) 119px, transparent 120px)",
        }}
      />
      {/* Brass glow */}
      <div className="absolute -top-40 start-1/4 size-[36rem] rounded-full bg-brass-500/10 blur-[120px]" />
      <div className="absolute bottom-0 end-0 size-[28rem] rounded-full bg-brass-600/10 blur-[100px]" />
      {/* Watermark */}
      <div className="absolute -bottom-24 end-0 select-none font-display text-[26rem] leading-none font-bold text-ivory-50/[0.025]">
        ك
      </div>
    </div>
  );
}
