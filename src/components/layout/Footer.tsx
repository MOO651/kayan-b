import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import {
  getBrand,
  getContact,
  getSocial,
} from "@/lib/settings";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";

export async function Footer() {
  const t = await getTranslations();
  const locale = await getLocale();
  const [brand, contact, social, services] = await Promise.all([
    getBrand(),
    getContact(),
    getSocial(),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 8,
    }),
  ]);

  const socialLinks = [
    { key: "facebook", url: social.facebook, icon: "facebook" },
    { key: "twitter", url: social.twitter, icon: "twitter" },
    { key: "linkedin", url: social.linkedin, icon: "linkedin" },
    { key: "instagram", url: social.instagram, icon: "instagram" },
  ].filter((s) => s.url);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-ivory-100">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo brand={brand} locale={locale} dark />
            <p className="mt-5 text-sm leading-relaxed text-ivory-100/60">
              {t("footer.about")}
            </p>
            {socialLinks.length > 0 && (
              <ul className="mt-6 flex items-center gap-3">
                {socialLinks.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.key}
                      className="flex size-9 items-center justify-center border border-ivory-50/15 text-ivory-100/70 transition-colors hover:border-brass-400 hover:text-brass-300"
                    >
                      <Icon name={s.icon} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label={t("footer.quickLinks")}>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-brass-400 uppercase">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {(
                [
                  ["home", "/"],
                  ["about", "/about"],
                  ["services", "/services"],
                  ["team", "/team"],
                  ["articles", "/articles"],
                  ["consultation", "/consultation"],
                  ["contact", "/contact"],
                ] as const
              ).map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-ivory-100/70 transition-colors hover:text-brass-300"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.services")}>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-brass-400 uppercase">
              {t("footer.services")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-ivory-100/70 transition-colors hover:text-brass-300"
                  >
                    {locale === "ar" ? service.titleAr : service.titleEn || service.titleAr}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-brass-400 uppercase">
              {t("footer.contact")}
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              {contact.addressAr && (
                <li className="flex items-start gap-3">
                  <Icon name="map-pin" className="mt-0.5 size-4 text-brass-400" />
                  <span className="text-ivory-100/70">
                    {locale === "ar" ? contact.addressAr : contact.addressEn || contact.addressAr}
                  </span>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-3 text-ivory-100/70 transition-colors hover:text-brass-300"
                  >
                    <Icon name="phone" className="size-4 text-brass-400" />
                    <span dir="ltr">{contact.phone}</span>
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 text-ivory-100/70 transition-colors hover:text-brass-300"
                  >
                    <Icon name="mail" className="size-4 text-brass-400" />
                    {contact.email}
                  </a>
                </li>
              )}
              {!contact.addressAr && !contact.phone && !contact.email && (
                <li>
                  <Link
                    href="/contact"
                    className="text-ivory-100/70 transition-colors hover:text-brass-300"
                  >
                    {t("nav.contact")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory-50/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-ivory-100/50 sm:flex-row lg:px-8">
          <p>
            © {year} {locale === "ar" ? brand.brandNameAr : brand.brandNameEn}.{" "}
            {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-brass-300"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-brass-300"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
