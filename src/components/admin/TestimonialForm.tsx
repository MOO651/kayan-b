"use client";

import { useActionState } from "react";
import {
  saveTestimonial,
  deleteTestimonial,
  type AdminState,
} from "@/lib/actions/admin";
import {
  Field,
  TextInput,
  TextArea,
  Checkbox,
  SubmitButton,
  FormMessage,
} from "./fields";
import { DeleteButton } from "./DeleteButton";
import { ImageField } from "./ImageField";

const initialState: AdminState = { status: "idle" };

export type TestimonialRow = {
  id: string;
  name: string;
  roleAr: string;
  roleEn: string;
  contentAr: string;
  contentEn: string;
  rating: number;
  photo: string;
  order: number;
  published: boolean;
};

export function TestimonialForm({ item }: { item?: TestimonialRow }) {
  const [state, action] = useActionState(saveTestimonial, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="اسم العميل" name="name" required error={errors.name}>
          <TextInput name="name" defaultValue={item?.name} maxLength={100} />
        </Field>
        <Field label="الصفة (مثال: صاحب شركة)" name="roleAr">
          <TextInput
            name="roleAr"
            defaultValue={item?.roleAr}
            maxLength={150}
          />
        </Field>
      </div>
      <Field
        label="نص الرأي (عربي)"
        name="contentAr"
        required
        error={errors.contentAr}
      >
        <TextArea name="contentAr" defaultValue={item?.contentAr} rows={4} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="نص الرأي (إنجليزي)" name="contentEn">
          <TextArea
            name="contentEn"
            defaultValue={item?.contentEn}
            rows={4}
            dir="ltr"
          />
        </Field>
        <Field label="الصفة (إنجليزي)" name="roleEn">
          <TextInput
            name="roleEn"
            defaultValue={item?.roleEn}
            dir="ltr"
            maxLength={150}
          />
        </Field>
      </div>
      <ImageField
        name="photo"
        label="صورة العميل (اختياري)"
        defaultValue={item?.photo}
      />
      <div className="flex flex-wrap items-end gap-6">
        <Field label="التقييم (1-5)" name="rating">
          <TextInput
            name="rating"
            type="number"
            defaultValue={String(item?.rating ?? 5)}
          />
        </Field>
        <Field label="الترتيب" name="order">
          <TextInput
            name="order"
            type="number"
            defaultValue={String(item?.order ?? 0)}
          />
        </Field>
        <Checkbox
          name="published"
          label="منشور"
          defaultChecked={item?.published ?? true}
        />
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton label={item ? "حفظ التعديلات" : "إضافة رأي"} />
        {item && (
          <DeleteButton
            small
            confirmMessage="سيتم حذف هذا الرأي نهائياً. متابعة؟"
            onDelete={deleteTestimonial.bind(null, item.id)}
          />
        )}
      </div>
    </form>
  );
}
