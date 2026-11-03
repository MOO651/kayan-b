"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";

export function DeleteButton({
  onDelete,
  label = "حذف",
  confirmMessage = "هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.",
  small = false,
}: {
  onDelete: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
  small?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span className="text-xs text-charcoal-600">{confirmMessage}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await onDelete();
            })
          }
          className="inline-flex items-center gap-1.5 bg-red-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
        >
          <Icon name="trash" className="size-3.5" />
          {pending ? "جارٍ الحذف…" : "تأكيد الحذف"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-xs font-semibold text-charcoal-700 transition-colors hover:text-charcoal-900"
        >
          إلغاء
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={
        small
          ? "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-600/10"
          : "inline-flex items-center gap-2 border border-red-600/30 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-600/10"
      }
    >
      <Icon name="trash" className="size-3.5" />
      {label}
    </button>
  );
}
