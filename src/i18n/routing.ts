import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Arabic (default) served at "/", English at "/en"
  localePrefix: "as-needed",
  // Always serve Arabic at "/" — don't redirect visitors to /en based on
  // their browser language; users switch explicitly via the language button.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
