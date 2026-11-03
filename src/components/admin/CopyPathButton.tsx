"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function CopyPathButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(path);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // clipboard unavailable
        }
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 transition-colors hover:text-brass-600"
    >
      <Icon name={copied ? "check" : "file-text"} className="size-3.5" />
      {copied ? "تم النسخ" : "نسخ المسار"}
    </button>
  );
}
