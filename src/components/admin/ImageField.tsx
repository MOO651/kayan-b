"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { inputClasses } from "./fields";

export function ImageField({
  name,
  label,
  defaultValue = "",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !result.path) {
        setError(result.error ?? "فشل رفع الصورة");
        return;
      }
      setValue(result.path);
    } catch {
      setError("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-charcoal-800">
        {label}
      </label>
      <input type="hidden" name={name} value={value} />

      <div className="flex items-start gap-4">
        {value ? (
          <div className="relative size-24 shrink-0 overflow-hidden border border-charcoal-900/15 bg-charcoal-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex size-24 shrink-0 items-center justify-center border border-dashed border-charcoal-900/20 text-charcoal-600/40">
            <Icon name="image" className="size-8" strokeWidth={1} />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 border border-charcoal-900/20 px-4 py-2 text-xs font-semibold text-charcoal-800 transition-colors hover:border-brass-500 hover:text-brass-600 disabled:opacity-60"
            >
              <Icon name="upload" className="size-4" />
              {uploading ? "جارٍ الرفع…" : "رفع صورة"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="inline-flex items-center gap-2 border border-red-600/30 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-600/10"
              >
                <Icon name="trash" className="size-4" />
                إزالة
              </button>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="/uploads/…"
            dir="ltr"
            className={cnInput()}
            aria-label={label}
          />
          {hint && <p className="text-xs text-charcoal-600/70">{hint}</p>}
          {error && (
            <p className="text-xs font-medium text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function cnInput() {
  return inputClasses + " text-start";
}
