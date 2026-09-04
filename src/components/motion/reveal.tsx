"use client";

import { m, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET = 28;

const DIRECTION_OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: OFFSET },
  down: { y: -OFFSET },
  left: { x: OFFSET },
  right: { x: -OFFSET },
  none: {},
};

type RevealProps = {
  children: ReactNode;
  /** Where the element travels *from*. `up` means it rises into place. */
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Adds a soft blur-in, which reads as more "premium" on headings. */
  blur?: boolean;
  /** Replay every time it scrolls into view instead of only the first time. */
  repeat?: boolean;
  as?: ElementType;
  className?: string;
  /** Anything else (aria-*, id, …) lands on the rendered element. */
  [key: `aria-${string}`]: unknown;
  id?: string;
};

/**
 * Scroll-triggered entrance. Animates transform + opacity only, so it stays on
 * the compositor thread. Under `prefers-reduced-motion` MotionConfig strips the
 * movement and leaves a plain fade.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  blur = false,
  repeat = false,
  as = "div",
  className,
  ...rest
}: RevealProps) {
  const MotionTag = m[as as "div"] ?? m.div;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...DIRECTION_OFFSET[direction],
      ...(blur ? { filter: "blur(8px)" } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: "blur(0px)" } : {}),
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <MotionTag
      {...rest}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount: 0.25, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </MotionTag>
  );
}
