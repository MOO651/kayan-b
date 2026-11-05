import { getLocale, getTranslations } from "next-intl/server";
import { getContact, getSocial } from "@/lib/settings";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon } from "@/components/ui/Icon";

export async function ContactSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const [contact, social] = await Promise.all([getContact(), getSocial()]);

  const socialLinks = [
    { key: "facebook", url: social.facebook, icon: "facebook" },
    { key: "twitter", url: social.twitter, icon: "twitter" },
    { key: "linkedin", url: social.linkedin, icon: "linkedin" },
    { key: "instagram", url: social.instagram, icon: "instagram" },
  ].filter((s) => s.url);

  const hasOfficeInfo = contact.egyptAddressAr || contact.egyptPhone || contact.egyptWhatsapp || contact.saudiAddressAr || contact.saudiPhone || contact.saudiWhatsapp;
  const hasInfo =
    contact.addressAr || contact.phone || contact.email || contact.whatsapp || hasOfficeInfo;

  return (
    <section className="bg-charcoal-900 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          dark
          kicker={t("home.contact.kicker")}
          title={t("home.contact.title")}
          subtitle={t("home.contact.text")}
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-5 lg:gap-20">
          {hasInfo && (
            <Reveal className="lg:col-span-2">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-brass-400 uppercase">
                {t("contact.info")}
              </h3>
              <ul className="mt-8 space-y-6">
                {contact.addressAr && (
                  <li className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center border border-brass-400/30 text-brass-400">
                      <Icon name="map-pin" className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-ivory-100/50 uppercase">
                        {t("contact.address")}
                      </p>
                      <p className="mt-1.5 leading-relaxed text-ivory-100">
                        {locale === "ar"
                          ? contact.addressAr
                          : contact.addressEn || contact.addressAr}
                      </p>
                    </div>
                  </li>
                )}
                {contact.phone && (
                  <li className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center border border-brass-400/30 text-brass-400">
                      <Icon name="phone" className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-ivory-100/50 uppercase">
                        {t("contact.phone")}
                      </p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="mt-1.5 block text-ivory-100 transition-colors hover:text-brass-300"
                      >
                        <span dir="ltr">{contact.phone}</span>
                      </a>
                    </div>
                  </li>
                )}
                {contact.whatsapp && (
                  <li className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center border border-brass-400/30 text-brass-400">
                      <Icon name="whatsapp" className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-ivory-100/50 uppercase">
                        {t("contact.whatsapp")}
                      </p>
                      <a
                        href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 block text-ivory-100 transition-colors hover:text-brass-300"
                      >
                        <span dir="ltr">{contact.whatsapp}</span>
                      </a>
                    </div>
                  </li>
                )}
                {contact.email && (
                  <li className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center border border-brass-400/30 text-brass-400">
                      <Icon name="mail" className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-ivory-100/50 uppercase">
                        {t("contact.email")}
                      </p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="mt-1.5 block text-ivory-100 transition-colors hover:text-brass-300"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </li>
                )}
              </ul>

              {hasOfficeInfo && (
                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  {([["مكتب مصر", contact.egyptAddressAr, contact.egyptAddressEn, contact.egyptPhone, contact.egyptWhatsapp], ["مكتب المملكة العربية السعودية", contact.saudiAddressAr, contact.saudiAddressEn, contact.saudiPhone, contact.saudiWhatsapp]] as const).map(([label, addressAr, addressEn, phone, whatsapp]) => (addressAr || phone || whatsapp) ? (
                    <div key={label} className="border border-brass-400/20 bg-white/[.03] p-5">
                      <p className="text-sm font-semibold text-brass-300">{label}</p>
                      {addressAr && <p className="mt-3 text-sm leading-7 text-ivory-100">{locale === "ar" ? addressAr : addressEn || addressAr}</p>}
                      {phone && <a href={`tel:${phone}`} className="mt-3 block text-sm text-ivory-100/80 hover:text-brass-300" dir="ltr">{phone}</a>}
                      {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-ivory-100/80 hover:text-brass-300" dir="ltr">WhatsApp: {whatsapp}</a>}
                    </div>
                  ) : null)}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="mt-10">
                  <p className="text-xs font-semibold tracking-wider text-ivory-100/50 uppercase">
                    {t("contact.followUs")}
                  </p>
                  <ul className="mt-4 flex items-center gap-3">
                    {socialLinks.map((s) => (
                      <li key={s.key}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.key}
                          className="flex size-10 items-center justify-center border border-ivory-50/15 text-ivory-100/70 transition-colors hover:border-brass-400 hover:text-brass-300"
                        >
                          <Icon name={s.icon} className="size-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          )}

          <Reveal
            delay={150}
            className={hasInfo ? "lg:col-span-3" : "lg:col-span-5"}
          >
            <h3 className="text-sm font-semibold tracking-[0.2em] text-brass-400 uppercase">
              {t("contact.formTitle")}
            </h3>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
