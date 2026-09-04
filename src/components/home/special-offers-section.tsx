"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ScrollCarousel } from "@/components/home/scroll-carousel";
import { AnimatedText } from "@/components/motion/animated-text";
import { WavyText } from "@/components/motion/wavy-text";
import { Reveal } from "@/components/motion/reveal";

type OfferItem = {
  duration: string;
  title: string;
  description: string;
};

export function SpecialOffersSection() {
  const t = useTranslations("Offers");
  const items = t.raw("items") as OfferItem[];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = carouselRef.current;
    if (!root) return;

    // The scrolling element owned by ScrollCarousel, matched on a stable data
    // hook rather than its utility classes.
    const track = root.querySelector<HTMLDivElement>("[data-carousel-track]");

    if (!track) return;

    const updateActive = () => {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;

      let closest = 0;
      let closestDistance = Infinity;

      Array.from(track.children).forEach((child, index) => {
        const card = child as HTMLElement;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    updateActive();

    let frame = 0;

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    track.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section className="bg-background py-16 lg:py-20 xl:py-[60px]">
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        <div ref={carouselRef}>
          <ScrollCarousel
            title={
              <AnimatedText
                as="h2"
                text={t("sectionTitle")}
                className="font-display text-[26px] font-normal leading-[38px] text-[#222222] dark:text-foreground sm:text-[36px]"
              />
            }
            previousLabel={t("previous")}
            nextLabel={t("next")}
            autoPlay
          >
            {items.map((item, i) => {
              const isActive = i === activeIndex;

              return (
                <m.article
                  key={item.title}
                  className="group relative h-[300px] w-[85vw] shrink-0 snap-start overflow-hidden rounded-[20px] sm:h-[420px] sm:w-[560px] xl:h-[535px] xl:w-[711px]"
                  // Entrance is opacity + scale, deliberately not a Y offset:
                  // `overflow-x-auto` on the track forces `overflow-y: auto`
                  // too, so a translated card is clipped by the scroller (and
                  // stays clipped if the in-view trigger hasn't fired yet).
                  // Scale grows from the centre and can't overflow the box.
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Image — scales gently toward the viewer on hover */}
                  <m.div
                    aria-hidden
                    className="absolute inset-0"
                    initial={false}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src="/images/coffe.webp"
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 711px, 85vw"
                    />
                  </m.div>

                  {/* Gradient */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/80"
                  />

                  {/* Duration */}
                  <m.span
                    // The pill is white in both themes (it sits on photography),
                    // so the label keeps the design's dark ink rather than the
                    // themed heading colour — which goes near-white in dark mode
                    // and would vanish against the pill.
                    className="absolute start-[22px] top-[21px] flex h-8 items-center justify-center rounded-[50px] bg-white px-4 text-[13px] font-semibold uppercase leading-5 text-[#212529]"
                    initial={{ opacity: 0, scale: 0.8, y: -8 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.25 + i * 0.12 }}
                  >
                    {item.duration}
                  </m.span>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 xl:ps-[33px] xl:pb-[46px]">
                    <WavyText
                      as="h3"
                      text={item.title}
                      className="font-display text-[22px] font-semibold leading-[34px] tracking-[-0.78px] text-white sm:text-[28px] [&>span]:justify-start"
                    />

                    {/* The active card reveals its blurb + CTA; the others fold
                        theirs away. Animating grid-template-rows lets the height
                        transition without hard-coding a pixel value. */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <m.div
                          key="details"
                          initial={{ opacity: 0, gridTemplateRows: "0fr" }}
                          animate={{ opacity: 1, gridTemplateRows: "1fr" }}
                          exit={{ opacity: 0, gridTemplateRows: "0fr" }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="grid"
                        >
                          <div className="flex flex-col gap-2 overflow-hidden">
                            {item.description && (
                              <p className="line-clamp-2 text-sm uppercase text-white/80">
                                {item.description}
                              </p>
                            )}

                            <m.div
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.97 }}
                              className="w-fit"
                              transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            >
                              <Link
                                href="/"
                                className="mt-2 inline-flex h-12 w-fit items-center justify-center rounded-[10px] bg-accent px-4 text-base text-white transition-colors hover:bg-accent-hover"
                              >
                                {t("bookNow")}
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
          </ScrollCarousel>
        </div>

        <Reveal className="mt-10 flex justify-center" delay={0.15}>
          <m.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Link
              href="/"
              className="inline-block rounded-[10px] border border-accent px-8 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {t("allOffers")}
            </Link>
          </m.div>
        </Reveal>
      </div>
    </section>
  );
}
