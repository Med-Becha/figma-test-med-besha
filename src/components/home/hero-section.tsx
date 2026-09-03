import { useTranslations } from "next-intl";
import { ShieldCheck, BadgePercent, Wallet, Sparkles } from "lucide-react";
import { ReservationWidget } from "@/components/home/reservation-widget";
import { WaveDivider } from "@/components/wave-divider";
import Image from "next/image";

const BADGE_ICONS = [Wallet, ShieldCheck, BadgePercent, Sparkles] as const;
const BADGE_KEYS = [
  "bestPrice",
  "securePayment",
  "flexibleRates",
  "exclusiveOffer",
] as const;

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="relative bg-background">
      <div className="mx-auto px-4 pt-4 sm:px-6 max-h-[714px] sm:pt-6 lg:px-6 lg:pt-6 xl:px-[20px] xl:pt-[20px]">
        {/* Figma: height 714, inset 25px, radius 20px on the top corners only. */}
        <div className="relative isolate overflow-hidden rounded-t-[20px]">
          <div className="absolute inset-0">
            <Image
              src="/images/heroImg.jpg"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Figma overlay: #1E2228 at 50% */}
          <div aria-hidden className="absolute inset-0 bg-[#1E222880]" />

          <div className="relative flex min-h-[560px] flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:min-h-[650px] lg:gap-10 xl:min-h-[714px]">
            <p className="text-sm uppercase tracking-normal text-white/80 sm:text-base">
              {t("welcomeLabel")}
            </p>
            <h1 className="font-display max-w-[966px] text-[32px] font-normal leading-tight text-white sm:text-[42px] sm:leading-[48px]">
              {t("title")}
            </h1>

            {/* Figma: row 923px wide, 24.5px gap, 52px gold circles, 16px icon gap */}
            <div className="flex max-w-[923px] flex-wrap items-center justify-center gap-x-6 gap-y-4">
              {BADGE_KEYS.map((key, i) => {
                const Icon = BADGE_ICONS[i];
                return (
                  <div key={key} className="flex items-center gap-4">
                    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <Icon
                        className="h-7 w-7"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </span>
                    <span className="text-[15px] leading-[18px] uppercase text-white">
                      {t(`badges.${key}`)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <WaveDivider placement="bottom" />
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-6 lg:pb-6 xl:px-[25px] xl:pb-[25px]">
        <ReservationWidget />
      </div>
    </section>
  );
}
