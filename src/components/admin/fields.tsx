"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export const inputClasses =
  "w-full border border-charcoal-900/15 bg-white px-4 py-2.5 text-sm text-charcoal-900 transition-colors focus:border-brass-500 focus:outline-none";

export function Field({
  label,
  name,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-charcoal-800"
      >
        {label} {required && <span className="text-brass-600">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-charcoal-600/70">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  name,
  defaultValue,
  type = "text",
  dir,
  placeholder,
  maxLength,
}: {
  name: string;
  defaultValue?: string;
  type?: string;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <input
      id={name}
      name={name}
      type={type}
      defaultValue={defaultValue}
      dir={dir}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cn(inputClasses, dir === "ltr" && "text-start")}
    />
  );
}

export function TextArea({
  name,
  defaultValue,
  rows = 4,
  dir,
  hint,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  dir?: "ltr" | "rtl";
  hint?: string;
}) {
  return (
    <textarea
      id={name}
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      dir={dir}
      className={cn(inputClasses, "resize-y", dir === "ltr" && "text-start")}
      aria-describedby={hint ? `${name}-hint` : undefined}
    />
  );
}

export function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-charcoal-800">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-brass-600"
      />
      {label}
    </label>
  );
}

export function SubmitButton({
  label = "حفظ",
  pendingLabel = "جارٍ الحفظ…",
}: {
  label?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 bg-charcoal-900 px-8 py-3 text-sm font-semibold text-ivory-50 transition-colors hover:bg-brass-600 disabled:opacity-60"
    >
      <Icon name="check" className="size-4" />
      {pending ? pendingLabel : label}
    </button>
  );
}

export function FormMessage({
  state,
  successMessage = "تم الحفظ بنجاح.",
}: {
  state: { status: string; message?: string };
  successMessage?: string;
}) {
  if (state.status === "success") {
    return (
      <p
        className="border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm font-medium text-green-800"
        role="status"
      >
        {successMessage}
      </p>
    );
  }
  if (state.status === "error" && state.message) {
    const messages: Record<string, string> = {
      slugTaken: "الرابط (slug) مستخدم من قبل. اختر رابطاً آخر.",
      emailTaken: "البريد الإلكتروني مستخدم من قبل.",
      weakPassword: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
    };
    return (
      <p
        className="border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-800"
        role="alert"
      >
        {messages[state.message] ?? "حدث خطأ. يرجى المحاولة مرة أخرى."}
      </p>
    );
  }
  return null;
}
