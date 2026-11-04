"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { BrandSettings } from "@/lib/settings";

const navKeys = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/team", key: "team" },
  { href: "/articles", key: "articles" },
  { href: "/contact", key: "contact" },
] as const;

export function Header({ brand }: { brand: BrandSettings }) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close the mobile menu on navigation (adjust state during render)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent py-5"
          : "bg-ivory-50/95 shadow-[0_1px_0_0] shadow-charcoal-900/10 backdrop-blur-md py-3",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 lg:gap-6 lg:px-8">
        <Link
          href="/"
          aria-label={t("common.brandName")}
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <Logo brand={brand} locale={locale} dark={transparent} compact />
        </Link>

        <nav aria-label={t("nav.home")} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navKeys.map(({ href, key }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={key}>
                  <Link
                    href={href}
                    className={cn(
                      "relative py-2 text-sm font-medium tracking-wide transition-colors duration-300",
                      "after:absolute after:bottom-0 after:start-0 after:h-px after:bg-brass-500 after:transition-all after:duration-300",
                      active ? "after:w-full" : "after:w-0 hover:after:w-full",
                      transparent
                        ? "text-ivory-100 hover:text-brass-300"
                        : "text-charcoal-800 hover:text-brass-600",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher dark={transparent} />
          <Link
            href="/consultation"
            className={cn(
              "hidden items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-300 sm:inline-flex",
              transparent
                ? "bg-brass-500 text-ink-950 hover:bg-brass-400"
                : "bg-charcoal-900 text-ivory-50 hover:bg-brass-600",
            )}
          >
            {t("header.consultation")}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
            className={cn(
              "relative z-50 inline-flex size-10 items-center justify-center border transition-colors lg:hidden",
              transparent
                ? "border-ivory-50/30 text-ivory-100"
                : "border-charcoal-900/20 text-charcoal-900",
            )}
          >
            <Icon name={menuOpen ? "x" : "menu"} />
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 bottom-0 z-40 h-svh flex flex-col bg-charcoal-900 pt-24 transition-all duration-500 lg:hidden",
          menuOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <nav className="flex-1 overflow-y-auto px-8 pb-10">
          <ul className="flex flex-col divide-y divide-ivory-50/10">
            {navKeys.map(({ href, key }, i) => (
              <li
                key={key}
                style={{ transitionDelay: `${i * 50}ms` }}
                className={cn(
                  "transition-all duration-500",
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                )}
              >
                <Link
                  href={href}
                  className="flex items-center justify-between py-5 font-display text-2xl font-semibold text-ivory-100 transition-colors hover:text-brass-300"
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {t(`nav.${key}`)}
                  <Icon
                    name="arrow-left"
                    className="size-5 text-brass-400 ltr:rotate-180"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/consultation"
            tabIndex={menuOpen ? 0 : -1}
            className="mt-8 flex items-center justify-center gap-2 bg-brass-500 px-6 py-4 text-base font-semibold text-ink-950 transition-colors hover:bg-brass-400"
          >
            {t("header.consultation")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
