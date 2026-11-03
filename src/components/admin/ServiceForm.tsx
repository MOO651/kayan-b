"use client";

import { useActionState } from "react";
import { saveService, type AdminState } from "@/lib/actions/admin";
import {
  Field,
  TextInput,
  TextArea,
  Checkbox,
  SubmitButton,
  FormMessage,
} from "./fields";
import { ImageField } from "./ImageField";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const initialState: AdminState = { status: "idle" };

const iconOptions = [
  "scale",
  "gavel",
  "building",
  "shield",
  "file-text",
  "handshake",
  "globe",
  "award",
  "briefcase",
  "users",
];

type Service = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  icon: string;
  image: string;
  order: number;
  published: boolean;
};

export function ServiceForm({ service }: { service?: Service }) {
  const [state, action] = useActionState(saveService, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-8">
      {service && <input type="hidden" name="id" value={service.id} />}

      <FormMessage state={state} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            المحتوى العربي
          </h2>
          <Field label="العنوان (عربي)" name="titleAr" required error={errors.titleAr}>
            <TextInput name="titleAr" defaultValue={service?.titleAr} maxLength={200} />
          </Field>
          <Field label="نبذة مختصرة (عربي)" name="excerptAr" error={errors.excerptAr}>
            <TextArea name="excerptAr" defaultValue={service?.excerptAr} rows={2} />
          </Field>
          <Field
            label="المحتوى التفصيلي (عربي)"
            name="contentAr"
            error={errors.contentAr}
            hint="افصل الفقرات بسطر فارغ. الأسطر التي تبدأ بـ «- » تتحول إلى قائمة نقطية."
          >
            <TextArea name="contentAr" defaultValue={service?.contentAr} rows={8} />
          </Field>
        </div>

        <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            المحتوى الإنجليزي
          </h2>
          <Field label="العنوان (إنجليزي)" name="titleEn" error={errors.titleEn}>
            <TextInput name="titleEn" defaultValue={service?.titleEn} dir="ltr" maxLength={200} />
          </Field>
          <Field label="نبذة مختصرة (إنجليزي)" name="excerptEn" error={errors.excerptEn}>
            <TextArea name="excerptEn" defaultValue={service?.excerptEn} rows={2} dir="ltr" />
          </Field>
          <Field label="المحتوى التفصيلي (إنجليزي)" name="contentEn" error={errors.contentEn}>
            <TextArea name="contentEn" defaultValue={service?.contentEn} rows={8} dir="ltr" />
          </Field>
        </div>
      </div>

      <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-charcoal-900">
          الإعدادات
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="الرابط (slug)"
            name="slug"
            required
            error={errors.slug ?? (state.message === "slugTaken" ? "مستخدم من قبل" : undefined)}
            hint="أحرف إنجليزية صغيرة وأرقام وشرطات فقط، مثال: criminal-law"
          >
            <TextInput name="slug" defaultValue={service?.slug} dir="ltr" maxLength={100} />
          </Field>
          <Field label="الترتيب" name="order" error={errors.order}>
            <TextInput
              name="order"
              type="number"
              defaultValue={String(service?.order ?? 0)}
              dir="ltr"
            />
          </Field>
        </div>

        <Field label="الأيقونة" name="icon">
          <IconPicker defaultValue={service?.icon ?? "scale"} />
        </Field>

        <ImageField
          name="image"
          label="صورة المجال (اختياري)"
          defaultValue={service?.image}
          hint="تُعرض في أعلى صفحة تفاصيل المجال."
        />

        <Checkbox
          name="published"
          label="منشور على الموقع"
          defaultChecked={service?.published ?? true}
        />
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton label={service ? "حفظ التعديلات" : "إضافة المجال"} />
      </div>
    </form>
  );
}

function IconPicker({ defaultValue }: { defaultValue: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="الأيقونة">
      {iconOptions.map((icon) => (
        <label
          key={icon}
          className={cn(
            "flex size-12 cursor-pointer items-center justify-center border transition-colors",
            "has-checked:border-brass-500 has-checked:bg-brass-500/10 has-checked:text-brass-600",
            "border-charcoal-900/15 text-charcoal-600 hover:border-brass-500/50",
          )}
        >
          <input
            type="radio"
            name="icon"
            value={icon}
            defaultChecked={icon === defaultValue}
            className="sr-only"
          />
          <Icon name={icon} className="size-5" />
        </label>
      ))}
    </div>
  );
}
