import "server-only";
import { cache } from "react";
import { db } from "./db";

export type BrandSettings = {
  brandNameAr: string;
  brandNameEn: string;
  taglineAr: string;
  taglineEn: string;
  logo: string;
};

export type ContactSettings = {
  phone: string;
  email: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  mapEmbedUrl: string;
};

export type SocialSettings = {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
};

export type HomeSettings = {
  heroImage: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  aboutImage: string;
  showTeam: boolean;
  showArticles: boolean;
  showPortfolio: boolean;
  showTestimonials: boolean;
  showFaq: boolean;
};

export type AboutSettings = {
  image: string;
  introAr: string;
  introEn: string;
  historyAr: string;
  historyEn: string;
  visionAr: string;
  visionEn: string;
  missionAr: string;
  missionEn: string;
  valuesAr: string;
  valuesEn: string;
  statsYears: string;
  statsCases: string;
  statsClients: string;
  statsTeam: string;
};

export const defaultBrand: BrandSettings = {
  brandNameAr: "مكي باشميل",
  brandNameEn: "Makki Bashmeel",
  taglineAr: "للمحاماة والاستشارات القانونية",
  taglineEn: "Law Firm & Legal Consultancy",
  logo: "",
};

export const defaultContact: ContactSettings = {
  phone: "",
  email: "",
  whatsapp: "",
  addressAr: "",
  addressEn: "",
  mapEmbedUrl: "",
};

export const defaultSocial: SocialSettings = {
  facebook: "",
  twitter: "",
  linkedin: "",
  instagram: "",
};

export const defaultHome: HomeSettings = {
  heroImage: "",
  heroTitleAr: "",
  heroTitleEn: "",
  heroSubtitleAr: "",
  heroSubtitleEn: "",
  aboutImage: "",
  showTeam: true,
  showArticles: true,
  showPortfolio: true,
  showTestimonials: true,
  showFaq: true,
};

export const defaultAbout: AboutSettings = {
  image: "",
  introAr: "",
  introEn: "",
  historyAr: "",
  historyEn: "",
  visionAr: "",
  visionEn: "",
  missionAr: "",
  missionEn: "",
  valuesAr: "",
  valuesEn: "",
  statsYears: "",
  statsCases: "",
  statsClients: "",
  statsTeam: "",
};

export const getSettings = cache(
  async <T>(key: string, fallback: T): Promise<T> => {
    const row = await db.setting.findUnique({ where: { key } });
    if (!row) return fallback;
    try {
      return { ...fallback, ...(JSON.parse(row.value) as Partial<T>) };
    } catch {
      return fallback;
    }
  },
);

export async function setSettings<T>(key: string, value: T): Promise<void> {
  await db.setting.upsert({
    where: { key },
    create: { key, value: JSON.stringify(value) },
    update: { value: JSON.stringify(value) },
  });
}

export const getBrand = () => getSettings("brand", defaultBrand);
export const getContact = () => getSettings("contact", defaultContact);
export const getSocial = () => getSettings("social", defaultSocial);
export const getHome = () => getSettings("home", defaultHome);
export const getAbout = () => getSettings("about", defaultAbout);
