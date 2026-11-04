"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Elegant back-to-top button — appears after scrolling past the hero. */
export function BackToTop() {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("backToTop")}
      className={cn(
        "fixed bottom-5 start-5 z-40 flex size-11 items-center justify-center border border-brass-500/40 bg-ivory-50/90 text-charcoal-900 shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-500 hover:bg-brass-500 hover:text-ink-950",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Icon name="arrow-up" className="size-5" />
    </button>
  );
}
