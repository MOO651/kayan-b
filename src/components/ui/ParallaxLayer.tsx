"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle parallax on the hero backdrop — the image layer drifts slower
 * than the page scroll. Uses rAF-throttled scroll, transform only
 * (no layout), and disables itself for prefers-reduced-motion.
 */
export function ParallaxLayer({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      // Only while the hero is on screen
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = Math.min(Math.max(-rect.top, 0), rect.height);
      el.style.transform = `translateY(${progress * 0.35}px) scale(1.08)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className={className} style={{ willChange: "transform" }} />;
}
