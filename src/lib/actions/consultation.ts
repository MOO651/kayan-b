"use server";

import { db } from "@/lib/db";
import { consultationSchema, contactSchema } from "@/lib/validations";

export type FormState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Record<string, string>;
};

function collectErrors(error: {
  issues: { path: PropertyKey[]; code: string }[];
}): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.code;
  }
  return fieldErrors;
}

export async function submitConsultation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    serviceId: formData.get("serviceId") ?? "",
    message: formData.get("message"),
    preferredContact: formData.get("preferredContact") ?? "phone",
    website: formData.get("website") ?? "",
  };

  const parsed = consultationSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: collectErrors(parsed.error) };
  }

  const data = parsed.data;

  // Honeypot filled → silently accept without saving (spam bot)
  if (data.website) {
    return { status: "success" };
  }

  try {
    await db.consultationRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        serviceId: data.serviceId || null,
        message: data.message,
        preferredContact: data.preferredContact,
      },
    });
    return { status: "success" };
  } catch {
    return { status: "error", fieldErrors: { form: "server" } };
  }
}

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: collectErrors(parsed.error) };
  }

  const data = parsed.data;
  if (data.website) {
    return { status: "success" };
  }

  try {
    await db.consultationRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
        preferredContact: "email",
      },
    });
    return { status: "success" };
  } catch {
    return { status: "error", fieldErrors: { form: "server" } };
  }
}
