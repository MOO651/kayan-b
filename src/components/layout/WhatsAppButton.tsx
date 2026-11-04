"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

/**
 * Floating WhatsApp button — hidden on the admin dashboard.
 * Reads the phone number from a server-rendered attribute to avoid
 * passing settings into a client component tree.
 */
export function WhatsAppButton({ phone }: { phone: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();

  // Hide on admin pages (rendered inside [locale] layout only — admin has
  // its own layout, but this also guards against future route changes).
  if (pathname.startsWith("/admin")) return null;

  const number = phone.replace(/[^0-9]/g, "");
  if (!number) return null;

  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    locale === "ar"
      ? "مرحباً، أرغب في استشارة قانونية."
      : "Hello, I would like a legal consultation.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="fixed bottom-5 end-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform duration-300 hover:scale-110"
    >
      <Icon name="whatsapp" className="size-7" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-20" />
    </a>
  );
}
