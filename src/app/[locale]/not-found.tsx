import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink-950 px-5">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,rgba(176,141,87,0.12),transparent)]"
      />
      <div className="relative text-center">
        <p className="font-display text-[8rem] leading-none font-bold text-brass-500/20 sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ivory-50 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ivory-100/70">{t("text")}</p>
        <div className="mt-10">
          <ButtonLink href="/" arrow>
            {t("cta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
