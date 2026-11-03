"use client";

import { useActionState } from "react";
import { saveCategory, type AdminState } from "@/lib/actions/admin";
import { Field, TextInput, SubmitButton, FormMessage } from "./fields";

const initialState: AdminState = { status: "idle" };

export function CategoryForm() {
  const [state, action] = useActionState(saveCategory, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} successMessage="تمت إضافة التصنيف." />
      <Field label="الاسم (عربي)" name="nameAr" required error={errors.nameAr}>
        <TextInput name="nameAr" maxLength={150} />
      </Field>
      <Field label="الاسم (إنجليزي)" name="nameEn" error={errors.nameEn}>
        <TextInput name="nameEn" dir="ltr" maxLength={150} />
      </Field>
      <Field
        label="الرابط (slug)"
        name="slug"
        required
        error={errors.slug ?? (state.message === "slugTaken" ? "مستخدم من قبل" : undefined)}
      >
        <TextInput name="slug" dir="ltr" maxLength={100} />
      </Field>
      <SubmitButton label="إضافة" />
    </form>
  );
}
