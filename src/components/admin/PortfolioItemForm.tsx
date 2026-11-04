"use client";

import { useActionState } from "react";
import {
  savePortfolioItem,
  deletePortfolioItem,
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

export type PortfolioRow = {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  outcomeAr: string;
  outcomeEn: string;
  image: string;
  tags: string;
  order: number;
  published: boolean;
};

export function PortfolioItemForm({ item }: { item?: PortfolioRow }) {
  const [state, action] = useActionState(savePortfolioItem, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="العنوان (عربي)"
          name="titleAr"
          required
          error={errors.titleAr}
        >
          <TextInput
            name="titleAr"
            defaultValue={item?.titleAr}
            maxLength={200}
          />
        </Field>
        <Field label="العنوان (إنجليزي)" name="titleEn">
          <TextInput
            name="titleEn"
            defaultValue={item?.titleEn}
            dir="ltr"
            maxLength={200}
          />
        </Field>
      </div>
      <Field label="نبذة عن القضية/العمل (عربي)" name="summaryAr">
        <TextArea name="summaryAr" defaultValue={item?.summaryAr} rows={3} />
      </Field>
      <Field label="نبذة (إنجليزي)" name="summaryEn">
        <TextArea
          name="summaryEn"
          defaultValue={item?.summaryEn}
          rows={3}
          dir="ltr"
        />
      </Field>
      <Field
        label="النتيجة / الإنجاز (عربي)"
        name="outcomeAr"
        hint="مثال: حكم بتعويض 2 مليون جنيه لصالح العميل"
      >
        <TextInput
          name="outcomeAr"
          defaultValue={item?.outcomeAr}
          maxLength={300}
        />
      </Field>
      <Field label="النتيجة (إنجليزي)" name="outcomeEn">
        <TextInput
          name="outcomeEn"
          defaultValue={item?.outcomeEn}
          dir="ltr"
          maxLength={300}
        />
      </Field>
      <ImageField
        name="image"
        label="صورة (اختياري)"
        defaultValue={item?.image}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="وسوم (مفصولة بفاصلة)"
          name="tags"
          hint="مثال: تجاري, تحكيم"
        >
          <TextInput name="tags" defaultValue={item?.tags} maxLength={200} />
        </Field>
        <Field label="الترتيب" name="order">
          <TextInput
            name="order"
            type="number"
            defaultValue={String(item?.order ?? 0)}
          />
        </Field>
      </div>
      <Checkbox
        name="published"
        label="منشور"
        defaultChecked={item?.published ?? true}
      />
      <div className="flex items-center gap-3">
        <SubmitButton label={item ? "حفظ التعديلات" : "إضافة عنصر"} />
        {item && (
          <DeleteButton
            small
            confirmMessage="سيتم حذف هذا العنصر نهائياً. متابعة؟"
            onDelete={deletePortfolioItem.bind(null, item.id)}
          />
        )}
      </div>
    </form>
  );
}
