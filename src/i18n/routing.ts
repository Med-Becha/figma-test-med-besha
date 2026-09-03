import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr", "ru", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeConfig: Record<
  Locale,
  { label: string; dir: "ltr" | "rtl"; nativeLabel: string }
> = {
  en: { label: "English", nativeLabel: "English", dir: "ltr" },
  fr: { label: "French", nativeLabel: "Français", dir: "ltr" },
  ru: { label: "Russian", nativeLabel: "Русский", dir: "ltr" },
  ar: { label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
