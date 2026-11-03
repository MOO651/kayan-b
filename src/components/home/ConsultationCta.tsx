import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export async function ConsultationCta() {
  const t = await getTranslations("home.consultation");

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-28">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(176,141,87,0.15),transparent)]"
      />
      <div
        aria-hidden
        className="absolute start-0 top-0 h-px w-full bg-gradient-to-l from-transparent via-brass-500/60 to-transparent"
      />
      <div
        aria-hidden
        className="absolute bottom-0 start-0 h-px w-full bg-gradient-to-l from-transparent via-brass-500/60 to-transparent"
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <p className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.25em] text-brass-400 uppercase">
            <span className="inline-block h-px w-8 bg-current" aria-hidden />
            {t("kicker")}
            <span className="inline-block h-px w-8 bg-current" aria-hidden />
          </p>
          <h2 className="mt-5 font-display text-3xl leading-snug font-semibold text-balance text-ivory-50 sm:text-4xl lg:text-5xl lg:leading-[1.2]">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ivory-100/70">
            {t("text")}
          </p>
          <div className="mt-10">
            <ButtonLink href="/consultation" arrow>
              {t("cta")}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
