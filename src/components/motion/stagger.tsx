"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/**
 * Orchestrates a list so children animate in sequence. The parent only owns the
 * timing; each `StaggerItem` owns its own movement, which keeps the two
 * concerns separate and lets any child opt into a different motion.
 */
export function StaggerGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  repeat = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  repeat?: boolean;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount: 0.2, margin: "0px 0px -60px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 260, damping: 26 },
        },
      }}
    >
      {children}
    </m.div>
  );
}
