import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { HeroSection } from "@/components/home/hero-section";
import { SpecialOffersSection } from "@/components/home/special-offers-section";
import { NewsSection } from "@/components/home/news-section";

/*
 * The two carousels were briefly loaded via `next/dynamic` to keep their client
 * bundles out of the initial payload. Measured, it made things slightly worse
 * (+8kB gzip): in the App Router these components still render on the server,
 * so Next preloads their chunks anyway and the only net effect was the extra
 * loader indirection. Kept as plain imports.
 */

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <SpecialOffersSection />
      <NewsSection />
    </>
  );
}
