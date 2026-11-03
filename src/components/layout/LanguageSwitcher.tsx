"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");
  const target = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={pathname}
      locale={target}
      lang={target}
      hrefLang={target}
      className={cn(
        "inline-flex items-center gap-2 border px-3.5 py-1.5 text-xs font-semibold tracking-wider transition-colors duration-300",
        dark
          ? "border-ivory-50/30 text-ivory-100 hover:border-brass-400 hover:text-brass-300"
          : "border-charcoal-900/20 text-charcoal-800 hover:border-brass-500 hover:text-brass-600",
      )}
      aria-label={t("language")}
    >
      {t("language")}
    </Link>
  );
}
