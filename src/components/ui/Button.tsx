import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Icon } from "./Icon";

type Variant = "primary" | "outline-light" | "outline-dark" | "ghost";

const base =
  "group/btn inline-flex items-center justify-center gap-3 px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brass-500 text-ink-950 hover:bg-brass-400 shadow-[0_8px_30px_-10px] shadow-brass-500/50",
  "outline-light":
    "border border-ivory-50/40 text-ivory-50 hover:border-brass-400 hover:text-brass-300",
  "outline-dark":
    "border border-charcoal-900/30 text-charcoal-900 hover:border-brass-500 hover:text-brass-600",
  ghost: "text-charcoal-900 hover:text-brass-600 px-2 py-1",
};

export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  arrow = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      <span>{children}</span>
      {arrow && (
        <Icon
          name="arrow-left"
          className="size-4 transition-transform duration-300 group-hover/btn:-translate-x-1 rtl:inline ltr:rotate-180 ltr:group-hover/btn:translate-x-1"
        />
      )}
    </Link>
  );
}
