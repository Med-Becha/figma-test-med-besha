import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { HeroSection } from "@/components/home/hero-section";
import { SpecialOffersSection } from "@/components/home/special-offers-section";
import { NewsSection } from "@/components/home/news-section";

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
