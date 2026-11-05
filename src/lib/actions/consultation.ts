"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  consultationSchema,
  contactSchema,
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_MIMES,
} from "@/lib/validations";
import { notifyNewRequest } from "@/lib/notify";

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

// Simple in-memory rate limit for public forms: max 5 submissions
// per IP per 10 minutes (complements the honeypot).
const formHits = new Map<string, { count: number; resetAt: number }>();
const FORM_MAX = 5;
const FORM_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = formHits.get(ip);
  if (!entry || entry.resetAt < now) {
    formHits.set(ip, { count: 1, resetAt: now + FORM_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > FORM_MAX;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

export async function submitConsultation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    country: formData.get("country") ?? "",
    preferredDate: formData.get("preferredDate") ?? "",
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

  if (isRateLimited(await clientIp())) {
    return { status: "error", fieldErrors: { form: "rate_limited" } };
  }

  // Optional attachment: PDF or image, max 5 MB — stored in the database,
  // never writable to the public filesystem and only served from the
  // authenticated admin panel.
  const file = formData.get("attachment");
  let attachmentName = "";
  let attachmentMime = "";
  let attachmentData: Uint8Array<ArrayBuffer> | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > ATTACHMENT_MAX_BYTES) {
      return { status: "error", fieldErrors: { attachment: "attachment_size" } };
    }
    if (!ATTACHMENT_MIMES.includes(file.type)) {
      return { status: "error", fieldErrors: { attachment: "attachment_type" } };
    }
    attachmentName = file.name.replace(/[\r\n\\/]/g, "_").slice(0, 200);
    attachmentMime = file.type;
    const bytes = await file.arrayBuffer();
    attachmentData = new Uint8Array(bytes.slice(0));
  }

  try {
    await db.consultationRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        country: data.country,
        preferredDate: data.preferredDate,
        serviceId: data.serviceId || null,
        message: data.message,
        preferredContact: data.preferredContact,
        attachmentName,
        attachmentMime,
        attachmentData,
      },
    });
    notifyNewRequest({
      subject: `طلب استشارة جديد — ${data.name}`,
      lines: [
        `<strong>الاسم:</strong> ${data.name}`,
        `<strong>الهاتف:</strong> ${data.phone}`,
        data.country ? `<strong>الدولة:</strong> ${data.country}` : "",
        data.preferredDate ? `<strong>الموعد المفضل:</strong> ${data.preferredDate}` : "",
        data.email ? `<strong>البريد:</strong> ${data.email}` : "",
        `<strong>تفضيل التواصل:</strong> ${data.preferredContact}`,
        attachmentData ? `<strong>مرفق:</strong> ${attachmentName}` : "",
        `<strong>الرسالة:</strong><br/>${data.message.replace(/\n/g, "<br/>")}`,
      ].filter(Boolean),
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

  if (isRateLimited(await clientIp())) {
    return { status: "error", fieldErrors: { form: "rate_limited" } };
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
    notifyNewRequest({
      subject: `رسالة جديدة من الموقع — ${data.name}`,
      lines: [
        `<strong>الاسم:</strong> ${data.name}`,
        `<strong>الهاتف:</strong> ${data.phone}`,
        `<strong>البريد:</strong> ${data.email}`,
        `<strong>الرسالة:</strong><br/>${data.message.replace(/\n/g, "<br/>")}`,
      ],
    });
    return { status: "success" };
  } catch {
    return { status: "error", fieldErrors: { form: "server" } };
  }
}
