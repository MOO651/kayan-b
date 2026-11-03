"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";
import { Icon } from "@/components/ui/Icon";

const initialState: LoginState = { status: "idle" };

const inputClasses =
  "w-full border border-ivory-50/15 bg-ivory-50/5 px-4 py-3 text-sm text-ivory-50 placeholder:text-ivory-100/40 transition-colors focus:border-brass-400 focus:outline-none";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-ivory-100"
        >
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          dir="ltr"
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-ivory-100"
        >
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          dir="ltr"
          className={inputClasses}
        />
      </div>

      {state.status === "error" && (
        <p
          className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {state.message === "rateLimited"
            ? "تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى بعد 10 دقائق."
            : "بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى."}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 bg-brass-500 px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brass-400 disabled:opacity-60"
      >
        <Icon name="logout" className="size-4 -scale-x-100" />
        {pending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
      </button>
    </form>
  );
}
