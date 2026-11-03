"use client";

import { useActionState } from "react";
import { saveUser, changePassword, type AdminState } from "@/lib/actions/admin";
import {
  Field,
  TextInput,
  SubmitButton,
  FormMessage,
  inputClasses,
} from "./fields";

const initialState: AdminState = { status: "idle" };

export function UserForm() {
  const [state, action] = useActionState(saveUser, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} successMessage="تمت إضافة المستخدم." />
      <Field label="الاسم" name="name" required error={errors.name}>
        <TextInput name="name" maxLength={100} />
      </Field>
      <Field
        label="البريد الإلكتروني"
        name="email"
        required
        error={errors.email ?? (state.message === "emailTaken" ? "مستخدم من قبل" : undefined)}
      >
        <TextInput name="email" type="email" dir="ltr" maxLength={150} />
      </Field>
      <Field
        label="كلمة المرور"
        name="password"
        required
        error={errors.password}
        hint="8 أحرف على الأقل"
      >
        <TextInput name="password" type="password" dir="ltr" maxLength={100} />
      </Field>
      <Field label="الصلاحية" name="role">
        <select id="role" name="role" defaultValue="EDITOR" className={inputClasses}>
          <option value="EDITOR">محرر — إدارة المحتوى</option>
          <option value="ADMIN">مدير — صلاحيات كاملة</option>
        </select>
      </Field>
      <SubmitButton label="إضافة المستخدم" />
    </form>
  );
}

export function PasswordForm({ userId }: { userId: string }) {
  const [state, action] = useActionState(changePassword, initialState);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={userId} />
      <FormMessage state={state} successMessage="تم تغيير كلمة المرور." />
      <Field label="كلمة المرور الجديدة" name="password" required>
        <TextInput name="password" type="password" dir="ltr" maxLength={100} />
      </Field>
      <SubmitButton label="تغيير" pendingLabel="جارٍ التغيير…" />
    </form>
  );
}
