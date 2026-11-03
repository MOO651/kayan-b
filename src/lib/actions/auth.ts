"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  destroySession,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

// Simple in-memory rate limiter for login attempts
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", message: "invalid" };
  }

  const email = parsed.data.email.toLowerCase();
  if (isRateLimited(email)) {
    return { status: "error", message: "rateLimited" };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return { status: "error", message: "invalid" };
  }

  await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role === "ADMIN" ? "ADMIN" : "EDITOR",
  });

  const next = formData.get("next");
  redirect(
    typeof next === "string" && next.startsWith("/admin") ? next : "/admin",
  );
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
