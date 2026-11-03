import { setRequestLocale } from "next-intl/server";
import { getBrand, getContact } from "@/lib/settings";
import { Hero } from "@/components/home/Hero";

export const dynamic = "force-dynamic";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhySection } from "@/components/home/WhySection";
import { TeamSection } from "@/components/home/TeamSection";
import { ArticlesSection } from "@/components/home/ArticlesSection";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { ContactSection } from "@/components/home/ContactSection";

export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [brand, contact] = await Promise.all([getBrand(), getContact()]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: locale === "ar" ? brand.brandNameAr : brand.brandNameEn,
    description:
      locale === "ar" ? brand.taglineAr : brand.taglineEn,
    url: siteUrl,
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.addressAr
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress:
              locale === "ar"
                ? contact.addressAr
                : contact.addressEn || contact.addressAr,
            addressCountry: "EG",
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <WhySection />
      <TeamSection />
      <ArticlesSection />
      <ConsultationCta />
      <ContactSection />
    </>
  );
}
