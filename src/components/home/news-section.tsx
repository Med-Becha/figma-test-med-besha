"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { AnimatedText } from "@/components/motion/animated-text";
import { WavyText } from "@/components/motion/wavy-text";
import { useAutoAdvance } from "@/lib/use-auto-advance";

// Card widths come from the Figma dev-mode inspector (Frame 2087329366):
// card 1 (collapsed) 328px, card 2 (expanded/center) 582px, card 3 (collapsed) 350px,
// gap 24px, height 535px. The active card takes the expanded width; inactive ones
// share the narrower width so the pattern generalizes as the user steps through.

type NewsItem = {
  title: string;
  description: string;
};

export function NewsSection() {
  const t = useTranslations("News");
  const items = t.raw("items") as NewsItem[];

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(1);

  const updateActiveCard = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateActiveCard();

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveCard);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateActiveCard]);

  function goToCard(index: number) {
    // Set state immediately — on large screens all cards already fit, so no
    // scroll event ever fires to drive the expand/collapse via the observer.
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function scrollByStep(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const isRtl = getComputedStyle(track).direction === "rtl";
    const next = Math.min(
      Math.max(activeIndex + direction * (isRtl ? -1 : 1), 0),
      items.length - 1,
    );
    goToCard(next);
  }

  // Cycles the expanded card while the visitor is idle; pauses on hover, focus,
  // manual interaction, off-screen, and for reduced-motion visitors.
  useAutoAdvance({
    ref: trackRef,
    interval: 6000,
    onAdvance: () => goToCard((activeIndex + 1) % items.length),
  });

  return (
    <section className="bg-surface-muted py-16 lg:py-20 xl:py-[60px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-[300px]">
        <div className="relative mb-6 flex items-center justify-center">
          <AnimatedText
            as="h2"
            text={t("sectionTitle")}
            className="font-display text-[28px] font-semibold text-text-heading"
          />
          <div className="absolute end-0 flex shrink-0 items-center gap-2">
            <m.button
              type="button"
              aria-label={t("previous")}
              onClick={() => scrollByStep(-1)}
              disabled={activeIndex === 0}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:bg-surface hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft className="h-4.5 w-4.5 rtl:rotate-180" />
            </m.button>
            <m.button
              type="button"
              aria-label={t("next")}
              onClick={() => scrollByStep(1)}
              disabled={activeIndex === items.length - 1}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:bg-surface hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight className="h-4.5 w-4.5 rtl:rotate-180" />
            </m.button>
          </div>
        </div>

        {/* The expanded column is animated as a grid-template-columns spring, so
            all three cards resize together in one interpolation rather than each
            fighting for width. */}
        <m.div
          ref={trackRef}
          className="grid gap-6 overflow-hidden py-2"
          animate={{
            gridTemplateColumns:
              activeIndex === 0
                ? "1fr 0.56fr 0.56fr"
                : activeIndex === 1
                  ? "0.56fr 1fr 0.56fr"
                  : "0.56fr 0.56fr 1fr",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <m.article
                key={item.title}
                ref={(el: HTMLElement | null) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => !isActive && goToCard(i)}
                // Scale rather than a Y offset — the track clips overflow, so a
                // translated card would be cut off before the entrance runs.
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={[
                  "group relative min-w-0 h-[420px] snap-start overflow-hidden rounded-[20px] sm:h-[480px] xl:h-[535px]",
                  isActive ? "cursor-default" : "cursor-pointer",
                ].join(" ")}
              >
                <div
                  aria-hidden
                  className={`absolute inset-0 transition-transform duration-500 ${
                    isActive ? "" : "group-hover:scale-105"
                  }`}
                >
                  <Image
                    src={`/images/news${i + 1}.webp`}
                    alt=""
                    fill
                    className="object-cover"
                    // Widest a card ever renders is the 582px expanded state.
                    sizes="(min-width: 1280px) 582px, (min-width: 640px) 45vw, 90vw"
                  />
                </div>
                {/* Figma: expanded card is covered top-to-bottom, collapsed cards
                    only from the halfway point down. */}
                <div
                  aria-hidden
                  className={
                    isActive
                      ? "absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80"
                      : "absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-b from-black/0 to-black/80"
                  }
                />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                  <m.span layout="position" className="text-lg leading-[34px] text-white">
                    {t("tag")}
                  </m.span>
                  <WavyText
                    as="h3"
                    text={item.title}
                    className="font-display max-w-[393px] text-2xl font-normal leading-[34px] text-white"
                    duration={3}
                    jump={5}
                  />

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <m.div
                        key="details"
                        initial={{ opacity: 0, gridTemplateRows: "0fr" }}
                        animate={{ opacity: 1, gridTemplateRows: "1fr" }}
                        exit={{ opacity: 0, gridTemplateRows: "0fr" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="grid"
                      >
                        <div className="flex flex-col gap-2 overflow-hidden">
                          <p className="max-w-[536px] text-lg leading-[22px] lowercase text-white">
                            {item.description}
                          </p>
                          <m.div
                            className="w-fit"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                          >
                            <Link
                              href="/"
                              className="mt-2 inline-flex h-12 w-[135px] items-center justify-center rounded-[10px] bg-accent px-4 py-1.5 text-base text-white transition-colors hover:bg-accent-hover"
                            >
                              {t("readMore")}
                            </Link>
                          </m.div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </m.article>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
