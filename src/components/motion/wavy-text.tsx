"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";

/** Cursive scripts (Arabic, Hebrew, …) lose their joining forms if split per glyph. */
const CURSIVE_SCRIPT = /[֐-ࣿיִ-﷿ﹰ-﻿]/;

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds for one full wave to travel across the string. */
  duration?: number;
  /** Vertical travel of each letter, in px. */
  jump?: number;
  /** Drop each letter into place once before the looping wave takes over. */
  entrance?: boolean;
  /** Seconds that entrance takes per letter. */
  entranceDuration?: number;
};

/**
 * A heading whose letters ride a looping wave.
 *
 * The motion is a CSS keyframe animation, not a JS one. Three offer cards with
 * titles like "Réservation anticipée en demi-pension" come to ~110 glyphs, and
 * driving that many independent JS animation loops stutters badly. As CSS, each
 * letter is a compositor-owned transform and the stagger is just a negative
 * `animation-delay`, so the whole effect costs effectively nothing per frame.
 *
 * An IntersectionObserver pauses the animation while the heading is off-screen.
 * Cursive scripts keep their string intact — per-glyph spans would sever the
 * letter joining — and the split glyphs are `aria-hidden` behind an
 * `aria-label`, so screen readers announce the sentence, not the characters.
 */
export function WavyText({
  text,
  as: Tag = "h2",
  className,
  duration = 2.6,
  jump = 6,
  entrance = false,
  entranceDuration = 0.6,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (CURSIVE_SCRIPT.test(text)) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  const characters = Array.from(text);
  const style = {
    "--wave-duration": `${duration}s`,
    "--wave-jump": `${jump}px`,
    "--enter-duration": `${entranceDuration}s`,
  } as CSSProperties;

  // Letters enter in reading order; the wave phase is spread across the string.
  const enterStagger = 0.035;

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      data-wave={inView ? "running" : "paused"}
      style={style}
    >
      <span aria-hidden>
        {characters.map((char, i) => {
          // Offsetting each letter into a later point of the same cycle is what
          // turns a row of bounces into one travelling wave.
          const wavePhase = (-(i / characters.length) * duration).toFixed(3);

          return (
            <span
              key={`${char}-${i}`}
              className={entrance ? "wave-letter wave-letter--enter" : "wave-letter"}
              style={{
                // With an entrance the delay list maps to [letter-in, letter-wave]:
                // the letter drops in on its own stagger, then the wave starts
                // once every letter has landed.
                animationDelay: entrance
                  ? `${(i * enterStagger).toFixed(3)}s, ${(
                      characters.length * enterStagger +
                      entranceDuration
                    ).toFixed(3)}s`
                  : `${wavePhase}s`,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
