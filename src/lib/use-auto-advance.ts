"use client";

import { useEffect, useRef, type RefObject } from "react";

type Options = {
  /** Element that counts as "the carousel" for hover/focus/visibility. */
  ref: RefObject<HTMLElement | null>;
  /** Called on each tick to move the carousel forward. */
  onAdvance: () => void;
  /** Milliseconds between automatic advances. */
  interval?: number;
  /** Quiet period after a manual interaction before auto-play resumes. */
  resumeDelay?: number;
  enabled?: boolean;
};

/**
 * Advances a carousel on its own while the visitor is idle.
 *
 * Auto-playing content has to yield to the person using it, so this pauses on:
 *  - pointer hover and keyboard focus anywhere inside the carousel
 *  - any manual interaction (arrow press, swipe, wheel), resuming only after a
 *    quiet period
 *  - the carousel scrolling out of view
 *  - the tab going to the background, so a hidden tab does no work
 *
 * It never starts at all for visitors who prefer reduced motion — WCAG 2.2.2
 * requires moving content to be pausable, and the least surprising way to
 * honour that preference is not to move in the first place.
 */
export function useAutoAdvance({
  ref,
  onAdvance,
  interval = 5000,
  resumeDelay = 9000,
  enabled = true,
}: Options) {
  // Kept in a ref so changing the callback each render doesn't restart the timer.
  // Synced in an effect rather than during render, since a render may be
  // discarded and must stay free of side effects.
  const advanceRef = useRef(onAdvance);
  useEffect(() => {
    advanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    let resumeTimer: number | undefined;
    let hovered = false;
    let focused = false;
    let inView = false;

    const canRun = () =>
      inView && !hovered && !focused && document.visibilityState === "visible";

    const stop = () => {
      window.clearInterval(timer);
      timer = undefined;
    };

    const start = () => {
      if (timer !== undefined || !canRun()) return;
      timer = window.setInterval(() => {
        if (canRun()) advanceRef.current();
        else stop();
      }, interval);
    };

    const sync = () => (canRun() ? start() : stop());

    /** A manual interaction buys the visitor a quiet period. */
    const deferForInteraction = () => {
      stop();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(sync, resumeDelay);
    };

    const onEnter = () => {
      hovered = true;
      stop();
    };
    const onLeave = () => {
      hovered = false;
      sync();
    };
    const onFocusIn = () => {
      focused = true;
      stop();
    };
    const onFocusOut = () => {
      focused = false;
      sync();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("pointerdown", deferForInteraction);
    el.addEventListener("wheel", deferForInteraction, { passive: true });
    el.addEventListener("touchstart", deferForInteraction, { passive: true });
    document.addEventListener("visibilitychange", sync);

    return () => {
      stop();
      window.clearTimeout(resumeTimer);
      observer.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("pointerdown", deferForInteraction);
      el.removeEventListener("wheel", deferForInteraction);
      el.removeEventListener("touchstart", deferForInteraction);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref, interval, resumeDelay, enabled]);
}
