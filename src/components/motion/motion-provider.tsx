"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Loads Motion's DOM feature set lazily (~18kb instead of the full bundle) and
 * sets the app-wide transition defaults. `reducedMotion="user"` makes every
 * animation in the tree honour `prefers-reduced-motion` automatically, so we
 * never have to guard individual components.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
