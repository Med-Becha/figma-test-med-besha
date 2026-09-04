"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, BadgePercent, Wallet, Sparkles } from "lucide-react";
import { m, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { ReservationWidget } from "@/components/home/reservation-widget";
import { WaveDivider } from "@/components/wave-divider";
import { WavyText } from "@/components/motion/wavy-text";
import { Magnetic } from "@/components/motion/interactive";

const BADGE_ICONS = [Wallet, ShieldCheck, BadgePercent, Sparkles] as const;
const BADGE_KEYS = [
  "bestPrice",
  "securePayment",
  "flexibleRates",
  "exclusiveOffer",
] as const;

export function HeroSection() {
  const t = useTranslations("Hero");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Drives the background parallax: the photo drifts slower than the page.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section className="relative bg-background">
      <div className="mx-auto px-4 pt-4 sm:px-6 max-h-[714px] sm:pt-6 lg:px-6 lg:pt-6 xl:px-[20px] xl:pt-[20px]">
        {/* Figma: height 714, inset 25px, radius 20px on the top corners only. */}
        <div ref={sectionRef} className="relative isolate overflow-hidden rounded-t-[20px]">
          {/* Parallax + slow Ken Burns push-in on the hero photograph. */}
          <m.div className="absolute inset-0 scale-110" style={{ y: imageY }}>
            <m.div
              className="relative h-full w-full"
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/images/heroImg.webp"
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </m.div>
          </m.div>

          {/* Figma overlay: #1E2228 at 50% */}
          <m.div
            aria-hidden
            className="absolute inset-0 bg-[#1E222880]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          <m.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="relative flex min-h-[560px] flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:min-h-[650px] lg:gap-10 xl:min-h-[714px]"
          >
            <m.p
              className="text-sm uppercase tracking-normal text-white/80 sm:text-base"
              initial={{ opacity: 0, y: 16, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0em" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("welcomeLabel")}
            </m.p>

            {/* Letters drop in, then settle into the looping wave. */}
            <WavyText
              as="h1"
              text={t("title")}
              className="font-display max-w-[966px] text-[32px] font-normal leading-tight text-white sm:text-[42px] sm:leading-[48px]"
              entrance
              duration={3.4}
              jump={7}
            />

            {/* Figma: row 923px wide, 24.5px gap, 52px gold circles, 16px icon gap */}
            <m.div
              className="flex max-w-[923px] flex-wrap items-center justify-center gap-x-6 gap-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } },
              }}
            >
              {BADGE_KEYS.map((key, i) => {
                const Icon = BADGE_ICONS[i];
                return (
                  <m.div
                    key={key}
                    className="flex items-center gap-4"
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.9 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { type: "spring", stiffness: 300, damping: 20 },
                      },
                    }}
                  >
                    <Magnetic strength={0.35}>
                      <m.span
                        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-accent text-white"
                        whileHover={{ scale: 1.12, rotate: -6 }}
                        transition={{ type: "spring", stiffness: 400, damping: 12 }}
                      >
                        <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                      </m.span>
                    </Magnetic>
                    <span className="text-[15px] leading-[18px] uppercase text-white">
                      {t(`badges.${key}`)}
                    </span>
                  </m.div>
                );
              })}
            </m.div>
          </m.div>

          <WaveDivider placement="bottom" />
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-6 lg:pb-6 xl:px-[25px] xl:pb-[25px]">
        <ReservationWidget />
      </div>
    </section>
  );
}
