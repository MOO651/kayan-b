"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContact, type FormState } from "@/lib/actions/consultation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const initialState: FormState = { status: "idle" };

const inputClasses =
  "w-full border border-ivory-50/15 bg-ivory-50/5 px-4 py-3 text-sm text-ivory-50 placeholder:text-ivory-100/40 transition-colors focus:border-brass-400 focus:outline-none";

export function ContactForm() {
  const t = useTranslations("form");
  const [state, action, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border border-brass-400/40 bg-brass-400/5 px-8 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brass-500 text-ink-950">
          <Icon name="check" className="size-7" />
        </span>
        <p className="max-w-md text-base leading-relaxed text-ivory-100">
          {t("successContact")}
        </p>
      </div>
    );
  }

  const err = (field: string) =>
    state.fieldErrors?.[field] ? (
      <p className="mt-1.5 text-xs font-medium text-red-300" role="alert">
        {errorMessage(t, field, state.fieldErrors[field])}
      </p>
    ) : null;

  return (
    <form action={action} className="space-y-5" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -start-[9999px] size-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="ct-name"
            className="mb-2 block text-sm font-semibold text-ivory-100"
          >
            {t("name")} <span className="text-brass-400">*</span>
          </label>
          <input
            id="ct-name"
            name="name"
            type="text"
            required
            maxLength={100}
            className={inputClasses}
            autoComplete="name"
          />
          {err("name")}
        </div>
        <div>
          <label
            htmlFor="ct-phone"
            className="mb-2 block text-sm font-semibold text-ivory-100"
          >
            {t("phone")} <span className="text-brass-400">*</span>
          </label>
          <input
            id="ct-phone"
            name="phone"
            type="tel"
            required
            maxLength={20}
            dir="ltr"
            className={cn(inputClasses, "text-start")}
            autoComplete="tel"
          />
          {err("phone")}
        </div>
      </div>

      <div>
        <label
          htmlFor="ct-email"
          className="mb-2 block text-sm font-semibold text-ivory-100"
        >
          {t("email")} <span className="text-brass-400">*</span>
        </label>
        <input
          id="ct-email"
          name="email"
          type="email"
          required
          maxLength={150}
          dir="ltr"
          className={cn(inputClasses, "text-start")}
          autoComplete="email"
        />
        {err("email")}
      </div>

      <div>
        <label
          htmlFor="ct-message"
          className="mb-2 block text-sm font-semibold text-ivory-100"
        >
          {t("messageContact")} <span className="text-brass-400">*</span>
        </label>
        <textarea
          id="ct-message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          className={cn(inputClasses, "resize-y")}
        />
        {err("message")}
      </div>

      {state.status === "error" && (
        <p className="text-sm font-medium text-red-300" role="alert">
          {t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-3 bg-brass-500 px-8 py-4 text-sm font-semibold text-ink-950 transition-colors hover:bg-brass-400 disabled:opacity-60"
      >
        <Icon name="send" className="size-4" />
        {pending ? t("sending") : t("submitContact")}
      </button>
    </form>
  );
}

function errorMessage(
  t: ReturnType<typeof useTranslations>,
  field: string,
  code: string | undefined,
): string {
  if (code === "too_small") return t("tooShort");
  if (code === "invalid_format" || code === "invalid_string") {
    if (field === "email") return t("invalidEmail");
    if (field === "phone") return t("invalidPhone");
  }
  return t("required");
}
