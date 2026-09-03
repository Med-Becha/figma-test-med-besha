"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ScrollCarousel } from "@/components/home/scroll-carousel";

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

    // Get the actual scrolling element from ScrollCarousel
    const track = root.querySelector(
      ".snap-x.snap-mandatory",
    ) as HTMLDivElement | null;

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
              <h2 className="font-display text-[26px] font-normal leading-[38px] text-[#222222] dark:text-foreground sm:text-[36px]">
                {t("sectionTitle")}
              </h2>
            }
            previousLabel={t("previous")}
            nextLabel={t("next")}
          >
            {items.map((item, i) => {
              const isActive = i === activeIndex;

              return (
                <article
                  key={item.title}
                  className="group relative h-[300px] w-[85vw] shrink-0 snap-start overflow-hidden rounded-[20px] sm:h-[420px] sm:w-[560px] xl:h-[535px] xl:w-[711px]"
                >
                  {/* Image */}
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  >
                    <Image
                      src="/images/coffe.jpg"
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 711px, 85vw"
                    />
                  </div>

                  {/* Gradient */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/80"
                  />

                  {/* Duration */}
                  <span className="absolute start-[22px] top-[21px] flex h-8 items-center justify-center rounded-[50px] bg-white px-4 text-[13px] font-semibold uppercase leading-5 text-text-heading">
                    {item.duration}
                  </span>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 xl:ps-[33px] xl:pb-[46px]">
                    <h3 className="font-display text-[22px] font-semibold leading-[34px] tracking-[-0.78px] text-white sm:text-[28px]">
                      {item.title}
                    </h3>

                    {isActive && (
                      <>
                        {item.description && (
                          <p className="line-clamp-2 text-sm uppercase text-white/80">
                            {item.description}
                          </p>
                        )}

                        <Link
                          href="/"
                          className="mt-2 inline-flex h-12 w-fit items-center justify-center rounded-[10px] bg-accent px-4 text-base text-white transition-colors hover:bg-accent-hover"
                        >
                          {t("bookNow")}
                        </Link>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </ScrollCarousel>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="rounded-[10px] border border-accent px-8 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            {t("allOffers")}
          </Link>
        </div>
      </div>
    </section>
  );
}
