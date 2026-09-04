"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { animate, m, useReducedMotion } from "motion/react";
import { useAutoAdvance } from "@/lib/use-auto-advance";

type Props = {
  children: ReactNode;
  title: ReactNode;
  previousLabel: string;
  nextLabel: string;
  /** Advance on its own while the visitor is idle. */
  autoPlay?: boolean;
};

export function ScrollCarousel({
  children,
  title,
  previousLabel,
  nextLabel,
  autoPlay = false,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const snapRestoreRef = useRef<number>(undefined);
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);

  /**
   * Which card currently sits at the track's inline-start edge. Measured from
   * bounding rects rather than `scrollLeft` because RTL scroll offsets are
   * inconsistent between engines, whereas rects are always physical pixels.
   */
  const readIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    setCount(cards.length);
    if (!cards.length) return;

    const isRtl = getComputedStyle(track).direction === "rtl";
    const trackRect = track.getBoundingClientRect();
    const edge = isRtl ? trackRect.right : trackRect.left;

    let nearest = 0;
    let nearestDistance = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardEdge = isRtl ? rect.right : rect.left;
      const distance = Math.abs(cardEdge - edge);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = i;
      }
    });
    setIndex(nearest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    readIndex();

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(readIndex);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [readIndex]);

  /**
   * Steps exactly one card per press.
   *
   * Three things had to be handled:
   *  - Scrolling by a fraction of the viewport (the previous approach) overshot
   *    a card, and scroll-snap then flung the track to an end instead of the
   *    neighbouring card. The delta is now measured from the target card itself.
   *  - `scroll-snap-type: mandatory` fights a programmatic scroll, yanking the
   *    track back to the current snap point, so snapping is suspended for the
   *    duration of the tween and restored once it settles.
   *  - Native `behavior: "smooth"` is unreliable — it is a no-op wherever the
   *    platform disables smooth scrolling (reduced-motion settings, some
   *    embedded/automated browsers). Tweening `scrollLeft` ourselves behaves
   *    identically everywhere, and we skip straight to the end position when
   *    the visitor has asked for reduced motion.
   */
  function scrollToIndex(targetIndex: number) {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const target = cards[Math.min(Math.max(targetIndex, 0), cards.length - 1)];
    if (!target) return;

    const isRtl = getComputedStyle(track).direction === "rtl";
    const trackRect = track.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    // Positive delta always means "scroll right", in either writing direction.
    const delta = isRtl
      ? targetRect.right - trackRect.right
      : targetRect.left - trackRect.left;

    const from = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    // Clamp so the last step lands flush against the end instead of overshooting.
    const to = Math.max(0, Math.min(from + delta, maxScroll));

    window.clearTimeout(snapRestoreRef.current);
    const restoreSnap = () => {
      track.style.scrollSnapType = "";
    };

    if (reduceMotion) {
      track.scrollLeft = to;
      return;
    }

    track.style.scrollSnapType = "none";
    animate(from, to, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        track.scrollLeft = value;
      },
      onComplete: restoreSnap,
    });
    // Safety net in case the tween is interrupted mid-flight.
    snapRestoreRef.current = window.setTimeout(restoreSnap, 900);
  }

  const step = (direction: 1 | -1) => scrollToIndex(index + direction);

  const atStart = index === 0;
  const atEnd = count > 0 && index >= count - 1;

  // Idle auto-play: step forward, wrapping back to the first card at the end.
  useAutoAdvance({
    ref: trackRef,
    enabled: autoPlay && count > 1,
    onAdvance: () => scrollToIndex(atEnd ? 0 : index + 1),
  });

  return (
    <div className="relative">
      {/* Figma: 48px gap between the heading row and the card row */}
      <div className="relative mb-6 flex items-center justify-center xl:mb-12">
        {title}
        <div className="absolute end-0 flex shrink-0 items-center gap-3">
          <m.button
            type="button"
            aria-label={previousLabel}
            onClick={() => step(-1)}
            disabled={atStart}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CED8E1] text-[#A2ADB7] transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-35 dark:border-border dark:text-text-muted"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" strokeWidth={2.5} />
          </m.button>
          <m.button
            type="button"
            aria-label={nextLabel}
            onClick={() => step(1)}
            disabled={atEnd}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CED8E1] text-[#A2ADB7] transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-35 dark:border-border dark:text-text-muted"
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2.5} />
          </m.button>
        </div>
      </div>
      {/* Figma: 24px gap between cards.
          `snap-proximity` rather than `snap-mandatory`: with mandatory snapping
          the final card can never align to the start edge (there isn't a full
          viewport of content left), so the engine drags the track back a card.
          Proximity keeps the snapping feel without trapping the last slide. */}
      <div
        ref={trackRef}
        data-carousel-track
        className="flex snap-x snap-proximity gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
