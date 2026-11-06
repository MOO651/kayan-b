"use client";

import { useActionState, useState } from "react";
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

const STEPS = [
  { key: "step1Title", fields: ["name", "phone", "email", "country"] },
  { key: "step2Title", fields: ["service", "message", "preferredDate"] },
  { key: "step3Title", fields: [] },
] as const;

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
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState("");

  // Validation errors on earlier steps → jump the user back to fix them.
  // Adjusting state during render (React-endorsed pattern) — no effect needed.
  const failedStep = STEPS.findIndex((s) =>
    s.fields.some((f) => state.fieldErrors?.[f]),
  );
  if (failedStep !== -1 && step !== failedStep) {
    setStep(failedStep);
  }

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
    <form action={action} className="space-y-6" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -start-[9999px] size-0 opacity-0"
      />

      {/* Step indicator */}
      <ol
        className="flex items-center gap-2"
        aria-label={`${t("step")} ${step + 1} ${t("of")} ${STEPS.length}`}
      >
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex flex-1 items-center gap-2">
            <span
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center border text-xs font-bold transition-colors duration-300",
                i < step && "border-brass-500 bg-brass-500 text-ink-950",
                i === step && "border-brass-500 text-brass-600",
                i > step && "border-charcoal-900/15 text-charcoal-600/50",
              )}
            >
              {i < step ? <Icon name="check" className="size-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-semibold sm:block",
                i === step ? "text-charcoal-900" : "text-charcoal-600/50",
              )}
            >
              {t(s.key)}
            </span>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1 transition-colors duration-500",
                  i < step ? "bg-brass-500" : "bg-charcoal-900/10",
                )}
              />
            )}
          </li>
        ))}
      </ol>

      {/* Step 1 — identity */}
      <div className={cn("space-y-5", step !== 0 && "hidden")}>
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
        <div>
          <label htmlFor="c-country" className="mb-2 block text-sm font-semibold">
            {t("country")}
          </label>
          <select id="c-country" name="country" defaultValue="Egypt" className={inputClasses}>
            <option value="Egypt">{t("egypt")}</option>
            <option value="Saudi Arabia">{t("saudiArabia")}</option>
            <option value="Other">{t("otherCountry")}</option>
          </select>
          {err("country")}
        </div>
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
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 bg-charcoal-900 px-6 py-3.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-brass-600"
          >
            {t("next")}
            <Icon name="arrow-left" className="size-4 ltr:rotate-180" />
          </button>
        </div>
      </div>

      {/* Step 2 — the case */}
      <div className={cn("space-y-5", step !== 1 && "hidden")}>
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
        <div>
          <label htmlFor="c-date" className="mb-2 block text-sm font-semibold">
            {t("preferredDate")}
          </label>
          <input id="c-date" name="preferredDate" type="date" min={new Date().toISOString().slice(0, 10)} className={inputClasses} />
          {err("preferredDate")}
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
      </div>

      {/* Step 3 — contact preference, attachment, submit */}
      <div className={cn("space-y-5", step !== 2 && "hidden")}>
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

        <div>
          <label htmlFor="c-attachment" className="mb-2 block text-sm font-semibold">
            {t("attachment")}
          </label>
          <label
            htmlFor="c-attachment"
            className="flex cursor-pointer items-center gap-3 border border-dashed border-charcoal-900/25 px-4 py-4 text-sm text-charcoal-600 transition-colors hover:border-brass-500 hover:text-brass-600"
          >
            <Icon name="paperclip" className="size-4 shrink-0" />
            <span className="truncate">
              {fileName || t("attachmentHint")}
            </span>
          </label>
          <input
            id="c-attachment"
            name="attachment"
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
          {err("attachment")}
        </div>

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

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 border border-charcoal-900/25 px-6 py-3.5 text-sm font-semibold text-charcoal-900 transition-colors hover:border-brass-500 hover:text-brass-600"
          >
            <Icon name="arrow-left" className="size-4 ltr:rotate-180" />
            {t("next")}
          </button>
        </div>
      </div>

      {/* Step navigation for steps 2 & 3 */}
      {step === 1 && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep(0)}
            className="inline-flex items-center gap-2 border border-charcoal-900/25 px-6 py-3.5 text-sm font-semibold text-charcoal-900 transition-colors hover:border-brass-500 hover:text-brass-600"
          >
            <Icon name="arrow-left" className="size-4 rtl:rotate-180" />
            {t("back")}
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center gap-2 bg-charcoal-900 px-6 py-3.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-brass-600"
          >
            {t("next")}
            <Icon name="arrow-left" className="size-4 ltr:rotate-180" />
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={pending}
            className="inline-flex items-center gap-2 border border-charcoal-900/25 px-6 py-3.5 text-sm font-semibold text-charcoal-900 transition-colors hover:border-brass-500 hover:text-brass-600 disabled:opacity-60"
          >
            <Icon name="arrow-left" className="size-4 rtl:rotate-180" />
            {t("back")}
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-3 bg-charcoal-900 px-8 py-3.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-brass-600 disabled:opacity-60"
          >
            <Icon name="send" className="size-4" />
            {pending ? t("sending") : t("submit")}
          </button>
        </div>
      )}
    </form>
  );
}

function errorMessage(
  t: ReturnType<typeof useTranslations>,
  field: string,
  code: string | undefined,
): string {
  if (code === "too_small") return t("tooShort");
  if (code === "attachment_size") return t("attachmentSize");
  if (code === "attachment_type") return t("attachmentType");
  if (code === "invalid_format" || code === "invalid_string") {
    if (field === "email") return t("invalidEmail");
    if (field === "phone") return t("invalidPhone");
  }
  return t("required");
}
