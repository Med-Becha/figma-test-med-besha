"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeConfig, type Locale } from "@/i18n/routing";
import { useParams } from "next/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("Language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onChange(next: Locale) {
    router.replace(
      // @ts-expect-error -- params shape is dynamic per-route, safe here
      { pathname, params },
      { locale: next },
    );
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{t("select")}</span>
      <select
        aria-label={t("select")}
        value={locale}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="h-9 rounded-full border border-border bg-surface px-3 pe-7 text-sm text-foreground/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeConfig[l].nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
