"use client";

import { useActionState } from "react";
import { saveFaq, deleteFaq, type AdminState } from "@/lib/actions/admin";
import {
  Field,
  TextInput,
  TextArea,
  Checkbox,
  SubmitButton,
  FormMessage,
} from "./fields";
import { DeleteButton } from "./DeleteButton";

const initialState: AdminState = { status: "idle" };

export type FaqRow = {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order: number;
  published: boolean;
};

export function FaqForm({ faq }: { faq?: FaqRow }) {
  const [state, action] = useActionState(saveFaq, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      {faq && <input type="hidden" name="id" value={faq.id} />}
      <Field
        label="السؤال (عربي)"
        name="questionAr"
        required
        error={errors.questionAr}
      >
        <TextInput
          name="questionAr"
          defaultValue={faq?.questionAr}
          maxLength={300}
        />
      </Field>
      <Field label="السؤال (إنجليزي)" name="questionEn">
        <TextInput
          name="questionEn"
          defaultValue={faq?.questionEn}
          dir="ltr"
          maxLength={300}
        />
      </Field>
      <Field
        label="الجواب (عربي)"
        name="answerAr"
        required
        error={errors.answerAr}
      >
        <TextArea name="answerAr" defaultValue={faq?.answerAr} rows={4} />
      </Field>
      <Field label="الجواب (إنجليزي)" name="answerEn">
        <TextArea
          name="answerEn"
          defaultValue={faq?.answerEn}
          rows={4}
          dir="ltr"
        />
      </Field>
      <div className="flex flex-wrap items-end gap-6">
        <Field label="الترتيب" name="order">
          <TextInput
            name="order"
            type="number"
            defaultValue={String(faq?.order ?? 0)}
          />
        </Field>
        <Checkbox
          name="published"
          label="منشور"
          defaultChecked={faq?.published ?? true}
        />
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton label={faq ? "حفظ التعديلات" : "إضافة سؤال"} />
        {faq && (
          <DeleteButton
            small
            confirmMessage="سيتم حذف هذا السؤال نهائياً. متابعة؟"
            onDelete={deleteFaq.bind(null, faq.id)}
          />
        )}
      </div>
    </form>
  );
}
