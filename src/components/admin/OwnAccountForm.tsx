"use client";

import { useActionState } from "react";
import { updateOwnAccount, type AdminState } from "@/lib/actions/admin";
import { Field, TextInput, SubmitButton, FormMessage } from "./fields";

const initialState: AdminState = { status: "idle" };

export function OwnAccountForm({
  user,
}: {
  user: { id: string; name: string; email: string };
}) {
  const [state, action] = useActionState(updateOwnAccount, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <input type="hidden" name="id" value={user.id} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="الاسم" name="name" required error={errors.name}>
          <TextInput name="name" defaultValue={user.name} maxLength={100} />
        </Field>
        <Field
          label="البريد الإلكتروني"
          name="email"
          required
          error={errors.email}
        >
          <TextInput
            name="email"
            type="email"
            defaultValue={user.email}
            dir="ltr"
            maxLength={150}
          />
        </Field>
      </div>
      <SubmitButton label="حفظ بياناتي" />
    </form>
  );
}
