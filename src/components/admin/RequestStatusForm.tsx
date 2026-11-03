"use client";

import { useActionState } from "react";
import { updateRequest, type AdminState } from "@/lib/actions/admin";
import {
  Field,
  TextArea,
  SubmitButton,
  FormMessage,
  inputClasses,
} from "./fields";

const initialState: AdminState = { status: "idle" };

export function RequestStatusForm({
  id,
  status,
  notes,
}: {
  id: string;
  status: string;
  notes: string;
}) {
  const [state, action] = useActionState(updateRequest, initialState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={id} />
      <FormMessage state={state} />

      <Field label="حالة الطلب" name="status">
        <select id="status" name="status" defaultValue={status} className={inputClasses}>
          <option value="NEW">جديد</option>
          <option value="IN_PROGRESS">قيد المتابعة</option>
          <option value="CLOSED">مغلق</option>
        </select>
      </Field>

      <Field
        label="ملاحظات داخلية"
        name="notes"
        hint="ملاحظات خاصة بالفريق — لا تظهر على الموقع."
      >
        <TextArea name="notes" defaultValue={notes} rows={5} />
      </Field>

      <SubmitButton label="حفظ الحالة" />
    </form>
  );
}
