import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticPages = [
    "",
    "/about",
    "/services",
    "/team",
    "/articles",
    "/consultation",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const [services, articles, lawyers] = await Promise.all([
    db.service.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    db.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    db.lawyer.findMany({
      where: { visible: true, NOT: { slug: null } },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPages) {
    for (const locale of ["ar", "en"] as const) {
      entries.push({
        url: `${siteUrl}${locale === "en" ? "/en" : ""}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: {
            ar: `${siteUrl}${path}`,
            en: `${siteUrl}/en${path}`,
          },
        },
      });
    }
  }

  for (const service of services) {
    for (const locale of ["ar", "en"] as const) {
      entries.push({
        url: `${siteUrl}${locale === "en" ? "/en" : ""}/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            ar: `${siteUrl}/services/${service.slug}`,
            en: `${siteUrl}/en/services/${service.slug}`,
          },
        },
      });
    }
  }

  for (const article of articles) {
    for (const locale of ["ar", "en"] as const) {
      entries.push({
        url: `${siteUrl}${locale === "en" ? "/en" : ""}/articles/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: {
          languages: {
            ar: `${siteUrl}/articles/${article.slug}`,
            en: `${siteUrl}/en/articles/${article.slug}`,
          },
        },
      });
    }
  }

  for (const path of ["/portfolio", "/team"]) {
    for (const locale of ["ar", "en"] as const) {
      entries.push({
        url: `${siteUrl}${locale === "en" ? "/en" : ""}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${siteUrl}${path}`,
            en: `${siteUrl}/en${path}`,
          },
        },
      });
    }
  }

  for (const lawyer of lawyers) {
    for (const locale of ["ar", "en"] as const) {
      entries.push({
        url: `${siteUrl}${locale === "en" ? "/en" : ""}/team/${lawyer.slug}`,
        lastModified: lawyer.updatedAt,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: {
          languages: {
            ar: `${siteUrl}/team/${lawyer.slug}`,
            en: `${siteUrl}/en/team/${lawyer.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
