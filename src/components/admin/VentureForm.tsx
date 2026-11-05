"use client";

import { useActionState } from "react";
import {
  saveVenture,
  deleteVenture,
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

export type VentureRow = {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  url: string;
  logo: string;
  image: string;
  order: number;
  published: boolean;
};

export function VentureForm({ venture }: { venture?: VentureRow }) {
  const [state, action] = useActionState(saveVenture, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      {venture && <input type="hidden" name="id" value={venture.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="الاسم (عربي)"
          name="nameAr"
          required
          error={errors.nameAr}
        >
          <TextInput name="nameAr" defaultValue={venture?.nameAr} maxLength={150} />
        </Field>
        <Field label="الاسم (إنجليزي)" name="nameEn">
          <TextInput
            name="nameEn"
            defaultValue={venture?.nameEn}
            dir="ltr"
            maxLength={150}
          />
        </Field>
      </div>
      <Field label="الوصف المختصر (عربي)" name="descAr">
        <TextArea name="descAr" defaultValue={venture?.descAr} rows={3} />
      </Field>
      <Field label="الوصف المختصر (إنجليزي)" name="descEn">
        <TextArea name="descEn" defaultValue={venture?.descEn} rows={3} dir="ltr" />
      </Field>
      <Field
        label="رابط الموقع"
        name="url"
        required
        error={errors.url}
        hint="رابط كامل يبدأ بـ https:// — يفتح في نافذة خارجية"
      >
        <TextInput
          name="url"
          type="url"
          defaultValue={venture?.url}
          dir="ltr"
          maxLength={300}
          placeholder="https://example.com"
        />
      </Field>
      <ImageField
        name="logo"
        label="الشعار (Logo)"
        defaultValue={venture?.logo}
        hint="شعار المشروع — يظهر داخل بطاقة صغيرة فوق الصورة."
      />
      <ImageField
        name="image"
        label="الصورة المصاحبة (اختياري)"
        defaultValue={venture?.image}
        hint="صورة تمثيلية للمشروع، أبعاد مقترحة 16:9."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="الترتيب" name="order">
          <TextInput
            name="order"
            type="number"
            defaultValue={String(venture?.order ?? 0)}
            dir="ltr"
          />
        </Field>
        <div className="flex items-end pb-1">
          <Checkbox
            name="published"
            label="ظاهر على الموقع"
            defaultChecked={venture?.published ?? true}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton label={venture ? "حفظ التعديلات" : "إضافة المشروع"} />
        {venture && (
          <DeleteButton
            small
            confirmMessage="سيتم حذف هذا المشروع نهائياً. متابعة؟"
            onDelete={deleteVenture.bind(null, venture.id)}
          />
        )}
      </div>
    </form>
  );
}
