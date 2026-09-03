"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

const CARD_GRADIENTS = [
  "from-[#0f2a4a] via-[#1c4a7a] to-[#4d8fd6]",
  "from-[#3a3222] via-[#6b5c3a] to-[#c6b25c]",
  "from-[#1a2e28] via-[#2f5c4a] to-[#5cc6a1]",
];

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

  return (
    <section className="bg-surface-muted py-16 lg:py-20 xl:py-[60px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-[300px]">
        <div className="relative mb-6 flex items-center justify-center">
          <h2 className="font-display text-[28px] font-semibold text-text-heading">
            {t("sectionTitle")}
          </h2>
          <div className="absolute end-0 flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={t("previous")}
              onClick={() => scrollByStep(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:bg-surface hover:text-foreground"
            >
              <ChevronLeft className="h-4.5 w-4.5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              aria-label={t("next")}
              onClick={() => scrollByStep(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:bg-surface hover:text-foreground"
            >
              <ChevronRight className="h-4.5 w-4.5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="grid gap-6 overflow-hidden py-2 transition-[grid-template-columns] duration-300 ease-out"
          style={{
            gridTemplateColumns:
              activeIndex === 0
                ? "1fr 0.56fr 0.56fr"
                : activeIndex === 1
                  ? "0.56fr 1fr 0.56fr"
                  : "0.56fr 0.56fr 1fr",
          }}
        >
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <article
                key={item.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => !isActive && goToCard(i)}
                className={[
                  "group relative min-w-0 h-[420px] snap-start overflow-hidden rounded-[20px] transition-all duration-300 ease-out sm:h-[480px] xl:h-[535px]",
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
                    src={`/images/news${i + 1}.png`}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 50vw, 90vw"
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
                  <span className="text-lg leading-[34px] text-white">
                    {t("tag")}
                  </span>
                  <h3 className="font-display max-w-[393px] text-2xl font-normal leading-[34px] text-white">
                    {item.title}
                  </h3>
                  {isActive && (
                    <>
                      <p className="max-w-[536px] text-lg leading-[22px] lowercase text-white">
                        {item.description}
                      </p>
                      <Link
                        href="/"
                        className="mt-2 inline-flex h-12 w-[135px] items-center justify-center rounded-[10px] bg-accent px-4 py-1.5 text-base text-white transition-colors hover:bg-accent-hover"
                      >
                        {t("readMore")}
                      </Link>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
