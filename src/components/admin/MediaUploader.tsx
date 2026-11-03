"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export function MediaUploader() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(files: FileList) {
    setUploading(true);
    setMessage("");
    let failed = 0;
    for (const file of Array.from(files)) {
      try {
        const data = new FormData();
        data.append("file", file);
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: data,
        });
        if (!response.ok) failed += 1;
      } catch {
        failed += 1;
      }
    }
    setUploading(false);
    setMessage(
      failed === 0
        ? "تم رفع الصور بنجاح."
        : `تم الرفع مع ${failed} ملف(ات) فاشلة.`,
    );
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="flex w-full flex-col items-center gap-3 border-2 border-dashed border-charcoal-900/20 px-6 py-10 text-charcoal-600 transition-colors hover:border-brass-500 hover:text-brass-600 disabled:opacity-60"
      >
        <Icon name="upload" className="size-8" strokeWidth={1.5} />
        <span className="text-sm font-semibold">
          {uploading ? "جارٍ الرفع…" : "اضغط لاختيار صور أو اسحبها هنا"}
        </span>
        <span className="text-xs text-charcoal-600/60">
          JPG, PNG, WebP, AVIF — بحد أقصى 5 ميجابايت للصورة
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void handleUpload(e.target.files);
          e.target.value = "";
        }}
      />
      {message && (
        <p className="mt-3 text-sm font-medium text-charcoal-700" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
