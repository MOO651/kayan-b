"use client";

import { useActionState } from "react";
import {
  saveBrandSettings,
  saveContactSettings,
  saveSocialSettings,
  saveHomeSettings,
  type AdminState,
} from "@/lib/actions/admin";
import type {
  BrandSettings,
  ContactSettings,
  SocialSettings,
  HomeSettings,
} from "@/lib/settings";
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

export function BrandSettingsForm({ brand }: { brand: BrandSettings }) {
  const [state, action] = useActionState(saveBrandSettings, initialState);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="اسم العلامة (عربي)" name="brandNameAr" required>
          <TextInput name="brandNameAr" defaultValue={brand.brandNameAr} maxLength={100} />
        </Field>
        <Field label="اسم العلامة (إنجليزي)" name="brandNameEn" required>
          <TextInput name="brandNameEn" defaultValue={brand.brandNameEn} dir="ltr" maxLength={100} />
        </Field>
        <Field label="الوصف المختصر (عربي)" name="taglineAr">
          <TextInput name="taglineAr" defaultValue={brand.taglineAr} maxLength={150} />
        </Field>
        <Field label="الوصف المختصر (إنجليزي)" name="taglineEn">
          <TextInput name="taglineEn" defaultValue={brand.taglineEn} dir="ltr" maxLength={150} />
        </Field>
      </div>
      <ImageField
        name="logo"
        label="الشعار (اختياري)"
        defaultValue={brand.logo}
        hint="عند رفع شعار يحل محل الشعار النصي الافتراضي."
      />
      <SubmitButton />
    </form>
  );
}

export function ContactSettingsForm({ contact }: { contact: ContactSettings }) {
  const [state, action] = useActionState(saveContactSettings, initialState);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="رقم الهاتف" name="phone">
          <TextInput name="phone" defaultValue={contact.phone} dir="ltr" maxLength={30} />
        </Field>
        <Field label="البريد الإلكتروني" name="email">
          <TextInput name="email" type="email" defaultValue={contact.email} dir="ltr" maxLength={150} />
        </Field>
        <Field label="واتساب" name="whatsapp" hint="بالصيغة الدولية، مثال: +2010XXXXXXXX">
          <TextInput name="whatsapp" defaultValue={contact.whatsapp} dir="ltr" maxLength={30} />
        </Field>
        <Field label="رابط خريطة جوجل (Embed)" name="mapEmbedUrl">
          <TextInput name="mapEmbedUrl" defaultValue={contact.mapEmbedUrl} dir="ltr" maxLength={500} />
        </Field>
        <Field label="العنوان (عربي)" name="addressAr">
          <TextInput name="addressAr" defaultValue={contact.addressAr} maxLength={300} />
        </Field>
        <Field label="العنوان (إنجليزي)" name="addressEn">
          <TextInput name="addressEn" defaultValue={contact.addressEn} dir="ltr" maxLength={300} />
        </Field>
      </div>
      <SubmitButton />
    </form>
  );
}

export function SocialSettingsForm({ social }: { social: SocialSettings }) {
  const [state, action] = useActionState(saveSocialSettings, initialState);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="فيسبوك" name="facebook">
          <TextInput name="facebook" defaultValue={social.facebook} dir="ltr" maxLength={300} placeholder="https://facebook.com/…" />
        </Field>
        <Field label="إكس (تويتر)" name="twitter">
          <TextInput name="twitter" defaultValue={social.twitter} dir="ltr" maxLength={300} placeholder="https://x.com/…" />
        </Field>
        <Field label="لينكدإن" name="linkedin">
          <TextInput name="linkedin" defaultValue={social.linkedin} dir="ltr" maxLength={300} placeholder="https://linkedin.com/company/…" />
        </Field>
        <Field label="إنستغرام" name="instagram">
          <TextInput name="instagram" defaultValue={social.instagram} dir="ltr" maxLength={300} placeholder="https://instagram.com/…" />
        </Field>
      </div>
      <SubmitButton />
    </form>
  );
}

export function HomeSettingsForm({ home }: { home: HomeSettings }) {
  const [state, action] = useActionState(saveHomeSettings, initialState);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <ImageField
        name="heroImage"
        label="صورة الواجهة الرئيسية"
        defaultValue={home.heroImage}
        hint="صورة معمارية أو قانونية عريضة عالية الجودة. عند تركها فارغة يظهر التصميم الافتراضي."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="عنوان الواجهة (عربي)" name="heroTitleAr" hint="اتركه فارغاً لاستخدام الافتراضي">
          <TextInput name="heroTitleAr" defaultValue={home.heroTitleAr} maxLength={150} />
        </Field>
        <Field label="عنوان الواجهة (إنجليزي)" name="heroTitleEn">
          <TextInput name="heroTitleEn" defaultValue={home.heroTitleEn} dir="ltr" maxLength={150} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="نص الواجهة (عربي)" name="heroSubtitleAr">
          <TextArea name="heroSubtitleAr" defaultValue={home.heroSubtitleAr} rows={3} />
        </Field>
        <Field label="نص الواجهة (إنجليزي)" name="heroSubtitleEn">
          <TextArea name="heroSubtitleEn" defaultValue={home.heroSubtitleEn} rows={3} dir="ltr" />
        </Field>
      </div>
      <ImageField
        name="aboutImage"
        label="صورة قسم «عن المكتب»"
        defaultValue={home.aboutImage}
      />
      <div className="flex flex-wrap gap-8">
        <Checkbox name="showTeam" label="إظهار قسم فريق العمل" defaultChecked={home.showTeam} />
        <Checkbox name="showArticles" label="إظهار قسم المقالات" defaultChecked={home.showArticles} />
      </div>
      <SubmitButton />
    </form>
  );
}
