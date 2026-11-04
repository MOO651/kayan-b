import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

async function getLawyer(slug: string) {
  return db.lawyer.findFirst({
    where: { slug, visible: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lawyer = await getLawyer(slug);
  if (!lawyer) return {};
  const name = locale === "ar" ? lawyer.nameAr : lawyer.nameEn || lawyer.nameAr;
  const title =
    locale === "ar" ? lawyer.titleAr : lawyer.titleEn || lawyer.titleAr;
  return {
    title: `${name}${title ? ` — ${title}` : ""}`,
    description: lawyer.bioAr.slice(0, 160),
    alternates: {
      canonical: locale === "ar" ? `/team/${slug}` : `/en/team/${slug}`,
      languages: { ar: `/team/${slug}`, en: `/en/team/${slug}` },
    },
  };
}

export default async function LawyerProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");

  const lawyer = await getLawyer(slug);
  if (!lawyer) notFound();

  const name = locale === "ar" ? lawyer.nameAr : lawyer.nameEn || lawyer.nameAr;
  const title =
    locale === "ar" ? lawyer.titleAr : lawyer.titleEn || lawyer.titleAr;
  const bio = locale === "ar" ? lawyer.bioAr : lawyer.bioEn || lawyer.bioAr;
  const specialties = lawyer.specialties
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader title={name} subtitle={title || undefined} />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Photo card */}
            <Reveal className="lg:col-span-1">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-charcoal-800 lg:max-w-none">
                {lawyer.photo ? (
                  <Image
                    src={lawyer.photo}
                    alt={name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-8xl font-bold text-brass-500/30">
                      {name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact details */}
              {(lawyer.email || lawyer.phone || lawyer.linkedin) && (
                <ul className="mx-auto mt-6 max-w-sm space-y-3 text-sm lg:max-w-none">
                  {lawyer.email && (
                    <li>
                      <a
                        href={`mailto:${lawyer.email}`}
                        className="flex items-center gap-3 text-charcoal-700 transition-colors hover:text-brass-600"
                      >
                        <Icon name="mail" className="size-4 text-brass-500" />
                        <span dir="ltr">{lawyer.email}</span>
                      </a>
                    </li>
                  )}
                  {lawyer.phone && (
                    <li>
                      <a
                        href={`tel:${lawyer.phone}`}
                        className="flex items-center gap-3 text-charcoal-700 transition-colors hover:text-brass-600"
                      >
                        <Icon name="phone" className="size-4 text-brass-500" />
                        <span dir="ltr">{lawyer.phone}</span>
                      </a>
                    </li>
                  )}
                  {lawyer.linkedin && (
                    <li>
                      <a
                        href={lawyer.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-charcoal-700 transition-colors hover:text-brass-600"
                      >
                        <Icon
                          name="linkedin"
                          className="size-4 text-brass-500"
                        />
                        LinkedIn
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </Reveal>

            {/* Bio */}
            <div className="lg:col-span-2">
              <Reveal>
                {bio && (
                  <div className="space-y-5 border-s-2 border-brass-500/40 ps-6 text-lg leading-relaxed text-charcoal-700">
                    {bio.split(/\n{2,}/).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </Reveal>

              {specialties.length > 0 && (
                <Reveal delay={100} className="mt-12">
                  <h2 className="font-display text-2xl font-semibold text-charcoal-900">
                    {t("specialties")}
                  </h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {specialties.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-3 border border-charcoal-900/10 bg-white px-4 py-3 text-sm text-charcoal-700"
                      >
                        <Icon
                          name="check"
                          className="size-4 shrink-0 text-brass-500"
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              <Reveal delay={200} className="mt-12">
                <ButtonLink href="/consultation" arrow>
                  {t("bookConsultation")}
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
