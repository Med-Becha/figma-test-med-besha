"use client";

import { m } from "motion/react";
import type { ElementType } from "react";

/** Cursive scripts (Arabic, Hebrew, …) lose their letter joining if split per glyph. */
const CURSIVE_SCRIPT = /[֐-ࣿיִ-﷿ﹰ-﻿]/;

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Seconds between each unit starting its animation. */
  stagger?: number;
  once?: boolean;
  /** Split granularity. Cursive scripts are forced to "word" regardless. */
  by?: "letter" | "word";
};

/**
 * Drops a heading into place one letter at a time as it scrolls into view.
 *
 * Letters are grouped inside per-word spans so wrapping still happens at word
 * boundaries, never mid-word. Arabic and other cursive scripts automatically
 * fall back to word-level splitting, because per-glyph spans would sever the
 * joining forms and render the text incorrectly.
 *
 * Accessibility: the animated glyphs are `aria-hidden` and the full string is
 * exposed once through `aria-label`, so screen readers announce a normal
 * sentence rather than a stream of single characters.
 */
export function AnimatedText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.04,
  once = true,
  by = "letter",
}: Props) {
  const splitBy = CURSIVE_SCRIPT.test(text) ? "word" : by;
  const words = text.split(" ");

  // Running index across the whole string so the stagger keeps flowing from one
  // word into the next instead of restarting per word.
  let unitIndex = 0;

  return (
    <Tag className={className} aria-label={text}>
      <m.span
        aria-hidden
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
      >
        {words.map((word, wordIdx) => {
          const units = splitBy === "letter" ? Array.from(word) : [word];

          return (
            <span key={`${word}-${wordIdx}`} className="inline-block whitespace-pre">
              {units.map((unit, i) => (
                <m.span
                  key={`${unit}-${unitIndex++}`}
                  className="inline-block whitespace-pre will-change-transform"
                  variants={{
                    hidden: { opacity: 0, y: "-0.6em", filter: "blur(4px)" },
                    visible: {
                      opacity: 1,
                      y: "0em",
                      filter: "blur(0px)",
                      transition: { type: "spring", stiffness: 320, damping: 24 },
                    },
                  }}
                >
                  {unit}
                  {/* keep the inter-word space inside the last unit of a word */}
                  {i === units.length - 1 && wordIdx < words.length - 1 ? " " : ""}
                </m.span>
              ))}
            </span>
          );
        })}
      </m.span>
    </Tag>
  );
}
