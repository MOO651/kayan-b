"use client";

import { useActionState } from "react";
import { saveLawyer, type AdminState } from "@/lib/actions/admin";
import {
  Field,
  TextInput,
  TextArea,
  Checkbox,
  SubmitButton,
  FormMessage,
} from "./fields";
import { ImageField } from "./ImageField";

const initialState: AdminState = { status: "idle" };

type Lawyer = {
  id: string;
  slug: string | null;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  bioAr: string;
  bioEn: string;
  photo: string;
  specialties: string;
  email: string;
  phone: string;
  linkedin: string;
  category: string;
  role: string;
  order: number;
  visible: boolean;
};

export function LawyerForm({ lawyer }: { lawyer?: Lawyer }) {
  const [state, action] = useActionState(saveLawyer, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-8">
      {lawyer && <input type="hidden" name="id" value={lawyer.id} />}

      <FormMessage state={state} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            البيانات بالعربية
          </h2>
          <Field label="الاسم (عربي)" name="nameAr" required error={errors.nameAr}>
            <TextInput name="nameAr" defaultValue={lawyer?.nameAr} maxLength={150} />
          </Field>
          <Field label="المسمى المهني (عربي)" name="titleAr" error={errors.titleAr}>
            <TextInput name="titleAr" defaultValue={lawyer?.titleAr} maxLength={150} />
          </Field>
          <Field label="السيرة المهنية (عربي)" name="bioAr" error={errors.bioAr}>
            <TextArea name="bioAr" defaultValue={lawyer?.bioAr} rows={6} />
          </Field>
        </div>

        <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            البيانات بالإنجليزية
          </h2>
          <Field label="الاسم (إنجليزي)" name="nameEn" error={errors.nameEn}>
            <TextInput name="nameEn" defaultValue={lawyer?.nameEn} dir="ltr" maxLength={150} />
          </Field>
          <Field label="المسمى المهني (إنجليزي)" name="titleEn" error={errors.titleEn}>
            <TextInput name="titleEn" defaultValue={lawyer?.titleEn} dir="ltr" maxLength={150} />
          </Field>
          <Field label="السيرة المهنية (إنجليزي)" name="bioEn" error={errors.bioEn}>
            <TextArea name="bioEn" defaultValue={lawyer?.bioEn} rows={6} dir="ltr" />
          </Field>
        </div>
      </div>

      <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-charcoal-900">
          الإعدادات
        </h2>
        <ImageField
          name="photo"
          label="الصورة الشخصية"
          defaultValue={lawyer?.photo}
          hint="صورة مهنية بخلفية هادئة، يُفضّل أبعاد 3:4."
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="التصنيف"
            name="category"
            error={errors.category}
            hint="الفريق القانوني أو فريق التطوير والحلول الرقمية"
          >
            <select
              name="category"
              defaultValue={lawyer?.category ?? "LEGAL"}
              className="w-full border border-charcoal-900/20 bg-white px-3 py-2 text-sm text-charcoal-900 outline-none focus:border-brass-500"
            >
              <option value="LEGAL">الفريق القانوني (محامون ومستشارون)</option>
              <option value="CONSULTANT">مستشار قانوني (مستقل)</option>
              <option value="PARTNER">شريك</option>
              <option value="DIGITAL">التطوير والحلول الرقمية</option>
            </select>
          </Field>
          <Field
            label="المسمى الوظيفي المحدد"
            name="role"
            error={errors.role}
            hint="مثال: محامٍ، مستشار قانوني، شريك، شريك التطوير والحلول الرقمية — سيظهر في الموقع"
          >
            <select
              name="role"
              defaultValue={lawyer?.role ?? ""}
              className="w-full border border-charcoal-900/20 bg-white px-3 py-2 text-sm text-charcoal-900 outline-none focus:border-brass-500"
            >
              <option value="">— اختر —</option>
              <option value="LAWYER">محامٍ</option>
              <option value="CONSULTANT">مستشار قانوني</option>
              <option value="PARTNER">شريك</option>
              <option value="DIGITAL">شريك التطوير والحلول الرقمية</option>
            </select>
          </Field>
          <Field label="الترتيب" name="order" error={errors.order}>
            <TextInput
              name="order"
              type="number"
              defaultValue={String(lawyer?.order ?? 0)}
              dir="ltr"
            />
          </Field>
        </div>
        <Field
          label="التخصصات / مجالات العمل"
          name="specialties"
          error={errors.specialties}
          hint="افصل بينها بفاصلة — مثال قانوني: القانون الجنائي، التحكيم — مثال رقمي: تطوير الويب، الحلول السحابية"
        >
          <TextInput name="specialties" defaultValue={lawyer?.specialties} maxLength={500} />
        </Field>
        <Field
          label="الرابط الشخصي (slug)"
          name="slug"
          error={errors.slug}
          hint="اتركه فارغاً إن لم ترغب في صفحة شخصية. أحرف إنجليزية صغيرة وشرطات فقط — مثال: ahmed-hassan"
        >
          <TextInput name="slug" defaultValue={lawyer?.slug ?? ""} dir="ltr" maxLength={100} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="البريد الإلكتروني" name="email">
            <TextInput name="email" type="email" defaultValue={lawyer?.email} dir="ltr" maxLength={150} />
          </Field>
          <Field label="رقم الهاتف" name="phone">
            <TextInput name="phone" defaultValue={lawyer?.phone} dir="ltr" maxLength={30} />
          </Field>
          <Field label="لينكدإن" name="linkedin">
            <TextInput name="linkedin" defaultValue={lawyer?.linkedin} dir="ltr" maxLength={300} placeholder="https://linkedin.com/in/…" />
          </Field>
        </div>
        <Checkbox
          name="visible"
          label="ظاهر على الموقع"
          defaultChecked={lawyer?.visible ?? true}
        />
      </div>

      <SubmitButton label={lawyer ? "حفظ التعديلات" : "إضافة العضو"} />
    </form>
  );
}
