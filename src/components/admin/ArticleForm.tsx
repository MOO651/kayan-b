"use client";

import { useActionState } from "react";
import { saveArticle, type AdminState } from "@/lib/actions/admin";
import {
  Field,
  TextInput,
  TextArea,
  Checkbox,
  SubmitButton,
  FormMessage,
  inputClasses,
} from "./fields";
import { ImageField } from "./ImageField";

const initialState: AdminState = { status: "idle" };

type Category = { id: string; nameAr: string };

type Article = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  image: string;
  categoryId: string | null;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  published: boolean;
};

export function ArticleForm({
  article,
  categories,
}: {
  article?: Article;
  categories: Category[];
}) {
  const [state, action] = useActionState(saveArticle, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-8">
      {article && <input type="hidden" name="id" value={article.id} />}

      <FormMessage state={state} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            المحتوى العربي
          </h2>
          <Field label="العنوان (عربي)" name="titleAr" required error={errors.titleAr}>
            <TextInput name="titleAr" defaultValue={article?.titleAr} maxLength={300} />
          </Field>
          <Field label="مقتطف (عربي)" name="excerptAr" error={errors.excerptAr}>
            <TextArea name="excerptAr" defaultValue={article?.excerptAr} rows={2} />
          </Field>
          <Field
            label="المحتوى (عربي)"
            name="contentAr"
            error={errors.contentAr}
            hint="افصل الفقرات بسطر فارغ. الأسطر التي تبدأ بـ «- » تتحول إلى قائمة نقطية."
          >
            <TextArea name="contentAr" defaultValue={article?.contentAr} rows={12} />
          </Field>
        </div>

        <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            المحتوى الإنجليزي
          </h2>
          <Field label="العنوان (إنجليزي)" name="titleEn" error={errors.titleEn}>
            <TextInput name="titleEn" defaultValue={article?.titleEn} dir="ltr" maxLength={300} />
          </Field>
          <Field label="مقتطف (إنجليزي)" name="excerptEn" error={errors.excerptEn}>
            <TextArea name="excerptEn" defaultValue={article?.excerptEn} rows={2} dir="ltr" />
          </Field>
          <Field label="المحتوى (إنجليزي)" name="contentEn" error={errors.contentEn}>
            <TextArea name="contentEn" defaultValue={article?.contentEn} rows={12} dir="ltr" />
          </Field>
        </div>
      </div>

      <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-charcoal-900">
          النشر
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="الرابط (slug)"
            name="slug"
            required
            error={errors.slug ?? (state.message === "slugTaken" ? "مستخدم من قبل" : undefined)}
            hint="أحرف إنجليزية صغيرة وأرقام وشرطات فقط"
          >
            <TextInput name="slug" defaultValue={article?.slug} dir="ltr" maxLength={150} />
          </Field>
          <Field label="التصنيف" name="categoryId" error={errors.categoryId}>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={article?.categoryId ?? ""}
              className={inputClasses}
            >
              <option value="">بدون تصنيف</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <ImageField
          name="image"
          label="الصورة الرئيسية (اختياري)"
          defaultValue={article?.image}
        />
        <Checkbox
          name="published"
          label="نشر المقال على الموقع"
          defaultChecked={article?.published ?? false}
        />
      </div>

      <div className="space-y-5 border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-charcoal-900">
          إعدادات SEO (اختياري)
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="عنوان SEO (عربي)" name="seoTitleAr" error={errors.seoTitleAr}>
            <TextInput name="seoTitleAr" defaultValue={article?.seoTitleAr} maxLength={300} />
          </Field>
          <Field label="عنوان SEO (إنجليزي)" name="seoTitleEn" error={errors.seoTitleEn}>
            <TextInput name="seoTitleEn" defaultValue={article?.seoTitleEn} dir="ltr" maxLength={300} />
          </Field>
          <Field label="وصف SEO (عربي)" name="seoDescAr" error={errors.seoDescAr}>
            <TextArea name="seoDescAr" defaultValue={article?.seoDescAr} rows={2} />
          </Field>
          <Field label="وصف SEO (إنجليزي)" name="seoDescEn" error={errors.seoDescEn}>
            <TextArea name="seoDescEn" defaultValue={article?.seoDescEn} rows={2} dir="ltr" />
          </Field>
        </div>
      </div>

      <SubmitButton label={article ? "حفظ التعديلات" : "إنشاء المقال"} />
    </form>
  );
}
