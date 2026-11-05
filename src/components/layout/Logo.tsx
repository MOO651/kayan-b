import { cn } from "@/lib/utils";
import type { BrandSettings } from "@/lib/settings";

export function Logo({
  brand,
  locale,
  dark = false,
  compact = false,
}: {
  brand: BrandSettings;
  locale: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const name = locale === "ar" ? brand.brandNameAr : brand.brandNameEn;
  const tagline = locale === "ar" ? brand.taglineAr : brand.taglineEn;

  if (brand.logo) {
    return (
      <span className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt={name} className="h-10 w-auto" />
        {!compact && (
          <span className="flex flex-col">
            <span
              className={cn(
                "font-display text-xl font-bold leading-tight",
                dark ? "text-ivory-50" : "text-charcoal-900",
              )}
            >
              {name}
            </span>
            <span
              className={cn(
                "text-[0.6rem] tracking-[0.2em] uppercase",
                dark ? "text-brass-400" : "text-brass-600",
              )}
            >
              {tagline}
            </span>
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden
        className={cn(
          "relative flex size-10 items-center justify-center",
          "before:absolute before:inset-0 before:rotate-45 before:border before:transition-colors",
          dark
            ? "before:border-brass-400 text-brass-300"
            : "before:border-brass-500 text-brass-600",
        )}
      >
        <span className="font-display text-lg font-bold leading-none">
        {name.trim().charAt(0)}
        </span>
      </span>
      {!compact && (
        <span className="flex flex-col">
          <span
            className={cn(
              "font-display text-xl font-bold leading-tight",
              dark ? "text-ivory-50" : "text-charcoal-900",
            )}
          >
            {name}
          </span>
          <span
            className={cn(
              "text-[0.6rem] tracking-[0.2em] uppercase",
              dark ? "text-brass-400" : "text-brass-600",
            )}
          >
            {tagline}
          </span>
        </span>
      )}
    </span>
  );
}
