"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function FaqSectionClient({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="mx-auto mt-14 max-w-3xl">
      <ul className="divide-y divide-charcoal-900/10 border-y border-charcoal-900/10">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-6 text-start"
              >
                <span className="font-display text-lg font-semibold text-charcoal-900">
                  {item.question}
                </span>
                <Icon
                  name="chevron-down"
                  className={cn(
                    "size-5 shrink-0 text-brass-600 transition-transform duration-300",
                    open && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="whitespace-pre-line leading-relaxed text-charcoal-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
