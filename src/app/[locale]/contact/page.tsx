import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactSection } from "@/components/home/ContactSection";
import { getContact } from "@/lib/settings";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "ar" ? "/contact" : "/en/contact",
      languages: { ar: "/contact", en: "/en/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const contact = await getContact();

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="-mt-1">
        <ContactSection />
      </div>

      {contact.mapEmbedUrl && (
        <section className="bg-charcoal-900 pb-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <div className="overflow-hidden border border-ivory-50/10">
                <iframe
                  src={contact.mapEmbedUrl}
                  title={t("address")}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[420px] w-full grayscale-[0.4]"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
