import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  dark = false,
  align = "center",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  align?: "center" | "start";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-start",
      )}
    >
      <p
        className={cn(
          "flex items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase",
          align === "center" && "justify-center",
          dark ? "text-brass-400" : "text-brass-600",
        )}
      >
        <span className="inline-block h-px w-8 bg-current" aria-hidden />
        {kicker}
        {align === "center" && (
          <span className="inline-block h-px w-8 bg-current" aria-hidden />
        )}
      </p>
      <h2
        className={cn(
          "mt-4 font-display text-3xl leading-snug font-semibold text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.25]",
          dark ? "text-ivory-50" : "text-charcoal-900",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            dark ? "text-ivory-100/70" : "text-charcoal-600",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
