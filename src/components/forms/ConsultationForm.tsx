"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  submitConsultation,
  type FormState,
} from "@/lib/actions/consultation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type ServiceOption = { id: string; title: string };

const initialState: FormState = { status: "idle" };

const inputClasses =
  "w-full border border-charcoal-900/15 bg-white/60 px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-600/50 transition-colors focus:border-brass-500 focus:outline-none";

export function ConsultationForm({
  services,
  preselectedService,
}: {
  services: ServiceOption[];
  preselectedService?: string;
}) {
  const t = useTranslations("form");
  const [state, action, pending] = useActionState(
    submitConsultation,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border border-brass-500/40 bg-brass-500/5 px-8 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brass-500 text-ink-950">
          <Icon name="check" className="size-7" />
        </span>
        <p className="max-w-md text-base leading-relaxed text-charcoal-800">
          {t("success")}
        </p>
      </div>
    );
  }

  const err = (field: string) =>
    state.fieldErrors?.[field] ? (
      <p className="mt-1.5 text-xs font-medium text-red-700" role="alert">
        {errorMessage(t, field, state.fieldErrors[field])}
      </p>
    ) : null;

  return (
    <form action={action} className="space-y-5" noValidate>
      {/* Honeypot */}
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
          <label htmlFor="c-name" className="mb-2 block text-sm font-semibold">
            {t("name")} <span className="text-brass-600">*</span>
          </label>
          <input
            id="c-name"
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
          <label htmlFor="c-phone" className="mb-2 block text-sm font-semibold">
            {t("phone")} <span className="text-brass-600">*</span>
          </label>
          <input
            id="c-phone"
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="mb-2 block text-sm font-semibold">
            {t("email")}
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            maxLength={150}
            dir="ltr"
            className={cn(inputClasses, "text-start")}
            autoComplete="email"
          />
          {err("email")}
        </div>
        <div>
          <label
            htmlFor="c-service"
            className="mb-2 block text-sm font-semibold"
          >
            {t("service")}
          </label>
          <select
            id="c-service"
            name="serviceId"
            defaultValue={preselectedService ?? ""}
            className={inputClasses}
          >
            <option value="">{t("servicePlaceholder")}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="c-message" className="mb-2 block text-sm font-semibold">
          {t("message")} <span className="text-brass-600">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          className={cn(inputClasses, "resize-y")}
        />
        {err("message")}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">
          {t("preferredContact")}
        </legend>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ["phone", "preferredPhone", "phone"],
              ["email", "preferredEmail", "mail"],
              ["whatsapp", "preferredWhatsapp", "whatsapp"],
            ] as const
          ).map(([value, labelKey, icon]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 border border-charcoal-900/15 px-4 py-2.5 text-sm transition-colors has-checked:border-brass-500 has-checked:bg-brass-500/10 has-checked:text-brass-600"
            >
              <input
                type="radio"
                name="preferredContact"
                value={value}
                defaultChecked={value === "phone"}
                className="sr-only"
              />
              <Icon name={icon} className="size-4" />
              {t(labelKey)}
            </label>
          ))}
        </div>
      </fieldset>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {t("error")}
        </p>
      )}
      {state.fieldErrors?.form && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-3 bg-charcoal-900 px-8 py-4 text-sm font-semibold text-ivory-50 transition-colors hover:bg-brass-600 disabled:opacity-60 sm:w-auto"
      >
        <Icon name="send" className="size-4" />
        {pending ? t("sending") : t("submit")}
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
