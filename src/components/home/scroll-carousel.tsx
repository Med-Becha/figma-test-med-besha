"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  children: ReactNode;
  title: ReactNode;
  previousLabel: string;
  nextLabel: string;
};

export function ScrollCarousel({ children, title, previousLabel, nextLabel }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const amount = el.clientWidth * 0.85 * (isRtl ? -1 : 1);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Figma: 48px gap between the heading row and the card row */}
      <div className="relative mb-6 flex items-center justify-center xl:mb-12">
        {title}
        <div className="absolute end-0 flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => scrollByAmount(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CED8E1] text-[#A2ADB7] transition-colors hover:bg-surface-muted dark:border-border dark:text-text-muted"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => scrollByAmount(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CED8E1] text-[#A2ADB7] transition-colors hover:bg-surface-muted dark:border-border dark:text-text-muted"
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {/* Figma: 24px gap between cards */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
