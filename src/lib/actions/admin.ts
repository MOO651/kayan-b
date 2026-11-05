"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser, requireAdmin, hashPassword } from "@/lib/auth";
import {
  serviceSchema,
  lawyerSchema,
  articleSchema,
  categorySchema,
  requestStatusSchema,
  userSchema,
  ventureSchema,
} from "@/lib/validations";
import {
  setSettings,
  type BrandSettings,
  type ContactSettings,
  type SocialSettings,
  type HomeSettings,
  type AboutSettings,
} from "@/lib/settings";

export type AdminState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

function fieldErrorsFrom(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

// ---------- Services ----------

export async function saveService(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");

  const parsed = serviceSchema.safeParse({
    slug: str(formData, "slug"),
    titleAr: str(formData, "titleAr"),
    titleEn: str(formData, "titleEn"),
    excerptAr: str(formData, "excerptAr"),
    excerptEn: str(formData, "excerptEn"),
    contentAr: str(formData, "contentAr"),
    contentEn: str(formData, "contentEn"),
    icon: str(formData, "icon"),
    image: str(formData, "image"),
    order: str(formData, "order"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  try {
    if (id) {
      await db.service.update({ where: { id }, data: parsed.data });
    } else {
      await db.service.create({ data: parsed.data });
    }
  } catch {
    return { status: "error", message: "slugTaken" };
  }

  revalidateSite();
  return { status: "success" };
}

export async function deleteService(id: string): Promise<void> {
  await requireUser();
  await db.service.delete({ where: { id } });
  revalidateSite();
}

// ---------- Team ----------

export async function saveLawyer(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");

  const parsed = lawyerSchema.safeParse({
    nameAr: str(formData, "nameAr"),
    nameEn: str(formData, "nameEn"),
    titleAr: str(formData, "titleAr"),
    titleEn: str(formData, "titleEn"),
    bioAr: str(formData, "bioAr"),
    bioEn: str(formData, "bioEn"),
    photo: str(formData, "photo"),
    specialties: str(formData, "specialties"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    linkedin: str(formData, "linkedin"),
    category: str(formData, "category") || "LEGAL",
    role: str(formData, "role"),
    order: str(formData, "order"),
    visible: formData.get("visible") === "on",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  if (id) {
    await db.lawyer.update({ where: { id }, data: parsed.data });
  } else {
    await db.lawyer.create({ data: parsed.data });
  }

  revalidateSite();
  return { status: "success" };
}

export async function deleteLawyer(id: string): Promise<void> {
  await requireUser();
  await db.lawyer.delete({ where: { id } });
  revalidateSite();
}

// ---------- External ventures ----------

export async function saveVenture(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");

  const parsed = ventureSchema.safeParse({
    nameAr: str(formData, "nameAr"),
    nameEn: str(formData, "nameEn"),
    descAr: str(formData, "descAr"),
    descEn: str(formData, "descEn"),
    url: str(formData, "url"),
    logo: str(formData, "logo"),
    image: str(formData, "image"),
    order: str(formData, "order"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  try {
    if (id) await db.externalVenture.update({ where: { id }, data: parsed.data });
    else await db.externalVenture.create({ data: parsed.data });
  } catch {
    return { status: "error" };
  }

  revalidateSite();
  revalidatePath("/admin/ventures");
  return { status: "success" };
}

export async function deleteVenture(id: string): Promise<void> {
  await requireUser();
  await db.externalVenture.delete({ where: { id } });
  revalidateSite();
  revalidatePath("/admin/ventures");
}

// ---------- Articles ----------

export async function saveArticle(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");

  const parsed = articleSchema.safeParse({
    slug: str(formData, "slug"),
    titleAr: str(formData, "titleAr"),
    titleEn: str(formData, "titleEn"),
    excerptAr: str(formData, "excerptAr"),
    excerptEn: str(formData, "excerptEn"),
    contentAr: str(formData, "contentAr"),
    contentEn: str(formData, "contentEn"),
    image: str(formData, "image"),
    categoryId: str(formData, "categoryId"),
    seoTitleAr: str(formData, "seoTitleAr"),
    seoTitleEn: str(formData, "seoTitleEn"),
    seoDescAr: str(formData, "seoDescAr"),
    seoDescEn: str(formData, "seoDescEn"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const data = {
    ...parsed.data,
    categoryId: parsed.data.categoryId || null,
    publishedAt: parsed.data.published ? new Date() : null,
  };

  try {
    if (id) {
      const existing = await db.article.findUnique({ where: { id } });
      await db.article.update({
        where: { id },
        data: {
          ...data,
          // Keep original publish date when staying published
          publishedAt:
            data.published && existing?.publishedAt
              ? existing.publishedAt
              : data.publishedAt,
        },
      });
    } else {
      await db.article.create({ data });
    }
  } catch {
    return { status: "error", message: "slugTaken" };
  }

  revalidateSite();
  return { status: "success" };
}

export async function deleteArticle(id: string): Promise<void> {
  await requireUser();
  await db.article.delete({ where: { id } });
  revalidateSite();
}

// ---------- Categories ----------

export async function saveCategory(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");

  const parsed = categorySchema.safeParse({
    slug: str(formData, "slug"),
    nameAr: str(formData, "nameAr"),
    nameEn: str(formData, "nameEn"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  try {
    if (id) {
      await db.category.update({ where: { id }, data: parsed.data });
    } else {
      await db.category.create({ data: parsed.data });
    }
  } catch {
    return { status: "error", message: "slugTaken" };
  }

  revalidateSite();
  return { status: "success" };
}

export async function deleteCategory(id: string): Promise<void> {
  await requireUser();
  await db.category.delete({ where: { id } });
  revalidateSite();
}

// ---------- Consultation requests ----------

export async function updateRequest(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");
  if (!id) return { status: "error" };

  const parsed = requestStatusSchema.safeParse({
    status: str(formData, "status"),
    notes: str(formData, "notes"),
  });
  if (!parsed.success) return { status: "error" };

  await db.consultationRequest.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath("/admin/requests");
  return { status: "success" };
}

export async function deleteRequest(id: string): Promise<void> {
  await requireAdmin();
  await db.consultationRequest.delete({ where: { id } });
  revalidatePath("/admin/requests");
}

// ---------- Settings ----------

export async function saveBrandSettings(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin();
  const value: BrandSettings = {
    brandNameAr: str(formData, "brandNameAr").trim() || "أفاق",
    brandNameEn: str(formData, "brandNameEn").trim() || "Afaq",
    taglineAr: str(formData, "taglineAr").trim(),
    taglineEn: str(formData, "taglineEn").trim(),
    logo: str(formData, "logo").trim(),
  };
  await setSettings("brand", value);
  revalidateSite();
  return { status: "success" };
}

export async function saveContactSettings(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin();
  const value: ContactSettings = {
    phone: str(formData, "phone").trim(),
    email: str(formData, "email").trim(),
    whatsapp: str(formData, "whatsapp").trim(),
    addressAr: str(formData, "addressAr").trim(),
    addressEn: str(formData, "addressEn").trim(),
    mapEmbedUrl: str(formData, "mapEmbedUrl").trim(),
  };
  await setSettings("contact", value);
  revalidateSite();
  return { status: "success" };
}

export async function saveSocialSettings(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin();
  const value: SocialSettings = {
    facebook: str(formData, "facebook").trim(),
    twitter: str(formData, "twitter").trim(),
    linkedin: str(formData, "linkedin").trim(),
    instagram: str(formData, "instagram").trim(),
  };
  await setSettings("social", value);
  revalidateSite();
  return { status: "success" };
}

export async function saveHomeSettings(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin();
  const value: HomeSettings = {
    heroImage: str(formData, "heroImage").trim(),
    heroTitleAr: str(formData, "heroTitleAr").trim(),
    heroTitleEn: str(formData, "heroTitleEn").trim(),
    heroSubtitleAr: str(formData, "heroSubtitleAr").trim(),
    heroSubtitleEn: str(formData, "heroSubtitleEn").trim(),
    aboutImage: str(formData, "aboutImage").trim(),
    showTeam: formData.get("showTeam") === "on",
    showArticles: formData.get("showArticles") === "on",
    showPortfolio: formData.get("showPortfolio") === "on",
    showTestimonials: formData.get("showTestimonials") === "on",
    showFaq: formData.get("showFaq") === "on",
  };
  await setSettings("home", value);
  revalidateSite();
  return { status: "success" };
}

// ---------- Users (ADMIN only) ----------

export async function updateOwnAccount(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const current = await requireUser();
  const id = str(formData, "id");
  // Only your own account
  if (id !== current.id) return { status: "error" };

  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  if (name.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    const fieldErrors: Record<string, string> = {};
    if (name.trim().length < 2) fieldErrors.name = "الاسم قصير جداً";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fieldErrors.email = "بريد غير صالح";
    return { status: "error", fieldErrors };
  }

  try {
    await db.user.update({ where: { id }, data: { name, email } });
  } catch {
    return { status: "error", message: "emailTaken" };
  }
  revalidatePath("/admin/settings");
  revalidatePath("/admin/users");
  return { status: "success" };
}

export async function saveUser(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin();

  const parsed = userSchema.safeParse({
    email: str(formData, "email"),
    name: str(formData, "name"),
    password: str(formData, "password"),
    role: str(formData, "role"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  try {
    await db.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name,
        passwordHash: hashPassword(parsed.data.password),
        role: parsed.data.role,
      },
    });
  } catch {
    return { status: "error", message: "emailTaken" };
  }

  revalidatePath("/admin/users");
  return { status: "success" };
}

export async function changePassword(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const current = await requireAdmin();
  const id = str(formData, "id");
  const password = str(formData, "password");
  if (!id || password.length < 8) {
    return { status: "error", message: "weakPassword" };
  }
  // Admins can change any password; editors only their own via this form on their row
  if (current.role !== "ADMIN" && current.id !== id) {
    return { status: "error" };
  }
  await db.user.update({
    where: { id },
    data: { passwordHash: hashPassword(password) },
  });
  revalidatePath("/admin/users");
  return { status: "success" };
}

export async function deleteUser(id: string): Promise<void> {
  const current = await requireAdmin();
  if (current.id === id) return; // cannot delete yourself
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

// ---------- Media ----------

export async function deleteMedia(id: string): Promise<void> {
  await requireUser();
  const media = await db.media.findUnique({ where: { id } });
  if (media) {
    await db.media.delete({ where: { id } });
    // File removal is best-effort; the record is the source of truth
    try {
      if (media.path.startsWith("http")) {
        // Vercel Blob
        const { del } = await import("@vercel/blob");
        await del(media.path);
      } else {
        const { unlink } = await import("node:fs/promises");
        const path = await import("node:path");
        const filePath = path.join(
          process.cwd(),
          "public",
          media.path.replace(/\//g, path.sep),
        );
        if (filePath.includes("uploads")) await unlink(filePath);
      }
    } catch {
      // file may already be gone
    }
  }
  revalidatePath("/admin/media");
}

// ---------- FAQ ----------

export async function saveFaq(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");

  const data = {
    questionAr: str(formData, "questionAr"),
    questionEn: str(formData, "questionEn"),
    answerAr: str(formData, "answerAr"),
    answerEn: str(formData, "answerEn"),
    order: Number(str(formData, "order") || 0),
    published: formData.get("published") === "on",
  };

  if (!data.questionAr.trim() || !data.answerAr.trim()) {
    return { status: "error", fieldErrors: { questionAr: "السؤال والجواب (عربي) مطلوبان" } };
  }

  try {
    if (id) await db.faq.update({ where: { id }, data });
    else await db.faq.create({ data });
  } catch {
    return { status: "error" };
  }

  revalidateSite();
  revalidatePath("/admin/faq");
  return { status: "success" };
}

export async function deleteFaq(id: string): Promise<void> {
  await requireUser();
  await db.faq.delete({ where: { id } });
  revalidateSite();
  revalidatePath("/admin/faq");
}

// ---------- Testimonials ----------

export async function saveTestimonial(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");

  const data = {
    name: str(formData, "name"),
    roleAr: str(formData, "roleAr"),
    roleEn: str(formData, "roleEn"),
    contentAr: str(formData, "contentAr"),
    contentEn: str(formData, "contentEn"),
    rating: Math.min(5, Math.max(1, Number(str(formData, "rating") || 5))),
    photo: str(formData, "photo"),
    order: Number(str(formData, "order") || 0),
    published: formData.get("published") === "on",
  };

  if (!data.name.trim() || !data.contentAr.trim()) {
    return { status: "error", fieldErrors: { name: "الاسم والرأي (عربي) مطلوبان" } };
  }

  try {
    if (id) await db.testimonial.update({ where: { id }, data });
    else await db.testimonial.create({ data });
  } catch {
    return { status: "error" };
  }

  revalidateSite();
  revalidatePath("/admin/testimonials");
  return { status: "success" };
}

export async function deleteTestimonial(id: string): Promise<void> {
  await requireUser();
  await db.testimonial.delete({ where: { id } });
  revalidateSite();
  revalidatePath("/admin/testimonials");
}

// ---------- Portfolio ----------

export async function savePortfolioItem(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireUser();
  const id = str(formData, "id");

  const data = {
    titleAr: str(formData, "titleAr"),
    titleEn: str(formData, "titleEn"),
    summaryAr: str(formData, "summaryAr"),
    summaryEn: str(formData, "summaryEn"),
    outcomeAr: str(formData, "outcomeAr"),
    outcomeEn: str(formData, "outcomeEn"),
    image: str(formData, "image"),
    tags: str(formData, "tags"),
    order: Number(str(formData, "order") || 0),
    published: formData.get("published") === "on",
  };

  if (!data.titleAr.trim()) {
    return { status: "error", fieldErrors: { titleAr: "العنوان (عربي) مطلوب" } };
  }

  try {
    if (id) await db.portfolioItem.update({ where: { id }, data });
    else await db.portfolioItem.create({ data });
  } catch {
    return { status: "error" };
  }

  revalidateSite();
  revalidatePath("/admin/portfolio");
  return { status: "success" };
}

export async function deletePortfolioItem(id: string): Promise<void> {
  await requireUser();
  await db.portfolioItem.delete({ where: { id } });
  revalidateSite();
  revalidatePath("/admin/portfolio");
}

// ---------- About page settings ----------

export async function saveAboutSettings(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin();
  const value: AboutSettings = {
    image: str(formData, "image"),
    introAr: str(formData, "introAr"),
    introEn: str(formData, "introEn"),
    historyAr: str(formData, "historyAr"),
    historyEn: str(formData, "historyEn"),
    visionAr: str(formData, "visionAr"),
    visionEn: str(formData, "visionEn"),
    missionAr: str(formData, "missionAr"),
    missionEn: str(formData, "missionEn"),
    valuesAr: str(formData, "valuesAr"),
    valuesEn: str(formData, "valuesEn"),
    statsYears: str(formData, "statsYears"),
    statsCases: str(formData, "statsCases"),
    statsClients: str(formData, "statsClients"),
    statsTeam: str(formData, "statsTeam"),
  };
  await setSettings("about", value);
  revalidateSite();
  revalidatePath("/about");
  return { status: "success" };
}
