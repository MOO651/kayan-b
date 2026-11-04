"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal. Content is visible by default; we only apply the
 * hidden state via a class added here BEFORE paint, so users never
 * see content disappear. Elements below the fold fade in on scroll;
 * anything already visible to the user never hides at all.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const viewport = window.innerHeight || 800;

    // Element is at least partially in view right now → show immediately.
    if (rect.top < viewport * 1.05) {
      element.classList.add("is-visible");
      return;
    }

    // Below the fold → fade in when it approaches the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      // Fire as soon as any part of the element approaches the viewport.
      { threshold: 0, rootMargin: "0px 0px 0px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
