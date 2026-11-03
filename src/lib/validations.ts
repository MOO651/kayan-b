import { z } from "zod";

const phoneRegex = /^[+\d][\d\s()-]{5,19}$/;

export const consultationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(phoneRegex).max(20),
  email: z
    .string()
    .trim()
    .email()
    .max(150)
    .or(z.literal(""))
    .default(""),
  serviceId: z.string().trim().max(50).default(""),
  message: z.string().trim().min(10).max(2000),
  preferredContact: z.enum(["phone", "email", "whatsapp"]).default("phone"),
  // Honeypot — must stay empty
  website: z.string().max(0).optional().default(""),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(phoneRegex).max(20),
  email: z.string().trim().email().max(150),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0).optional().default(""),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(150),
  password: z.string().min(8).max(100),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  titleAr: z.string().trim().min(2).max(200),
  titleEn: z.string().trim().max(200).default(""),
  excerptAr: z.string().trim().max(500).default(""),
  excerptEn: z.string().trim().max(500).default(""),
  contentAr: z.string().trim().max(20000).default(""),
  contentEn: z.string().trim().max(20000).default(""),
  icon: z.string().trim().max(50).default(""),
  image: z.string().trim().max(500).default(""),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  published: z.coerce.boolean().default(true),
});

export const lawyerSchema = z.object({
  nameAr: z.string().trim().min(2).max(150),
  nameEn: z.string().trim().max(150).default(""),
  titleAr: z.string().trim().max(150).default(""),
  titleEn: z.string().trim().max(150).default(""),
  bioAr: z.string().trim().max(5000).default(""),
  bioEn: z.string().trim().max(5000).default(""),
  photo: z.string().trim().max(500).default(""),
  specialties: z.string().trim().max(500).default(""),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  visible: z.coerce.boolean().default(true),
});

export const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9-]+$/),
  titleAr: z.string().trim().min(2).max(300),
  titleEn: z.string().trim().max(300).default(""),
  excerptAr: z.string().trim().max(600).default(""),
  excerptEn: z.string().trim().max(600).default(""),
  contentAr: z.string().trim().max(50000).default(""),
  contentEn: z.string().trim().max(50000).default(""),
  image: z.string().trim().max(500).default(""),
  categoryId: z.string().trim().max(50).default(""),
  seoTitleAr: z.string().trim().max(300).default(""),
  seoTitleEn: z.string().trim().max(300).default(""),
  seoDescAr: z.string().trim().max(500).default(""),
  seoDescEn: z.string().trim().max(500).default(""),
  published: z.coerce.boolean().default(false),
});

export const categorySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  nameAr: z.string().trim().min(2).max(150),
  nameEn: z.string().trim().max(150).default(""),
});

export const requestStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]),
  notes: z.string().trim().max(2000).default(""),
});

export const userSchema = z.object({
  email: z.string().trim().email().max(150),
  name: z.string().trim().min(2).max(100),
  password: z.string().min(8).max(100),
  role: z.enum(["ADMIN", "EDITOR"]),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
