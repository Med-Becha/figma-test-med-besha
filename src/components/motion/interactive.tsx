"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

/**
 * Press/hover feedback for anything clickable. Scale only — no layout thrash.
 */
export function Pressable({
  children,
  className,
  scale = 1.04,
  tapScale = 0.96,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
  tapScale?: number;
}) {
  return (
    <m.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: tapScale }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </m.div>
  );
}

/**
 * Cursor-following tilt. The pointer position drives two springs, so the element
 * eases toward the cursor instead of snapping — used on the hero badges and the
 * search button for a bit of depth.
 */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  );
}

/**
 * Parallax: maps the element's scroll progress onto a small Y translation.
 * Kept subtle (±`distance`px) so it reads as depth rather than drift.
 */
export function useParallaxStyle(progress: ReturnType<typeof useMotionValue<number>>, distance = 40) {
  return useTransform(progress, [0, 1], [-distance, distance]);
}
