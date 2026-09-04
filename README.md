# Marhaba Palace — Front-End Test

A Next.js recreation of the "Test-front-end-2026" Figma design (Royal Court hotel
booking landing page), built for the frontend technical test.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **next-intl** for i18n and locale routing
- **next-themes** for light/dark mode
- **lucide-react** for iconography

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/en` by
default. Other builds:

```bash
npm run build   # production build (all 4 locales are statically prerendered)
npm run start   # serve the production build
npm run lint    # ESLint
```

## Features

- **Pixel-matched desktop layout** — colors, font families/weights/sizes,
  border radii, spacing and hover states were read directly from the Figma
  file's inspector (not eyeballed) and applied as exact values at the `xl`
  breakpoint (1280px+), matching the 1920px-wide source frame 1:1. Tablet and
  mobile layouts below that are original responsive adaptations, since the
  Figma file only specifies a desktop frame.
- **Light / dark mode** — toggle in the header, persisted, respects the
  system preference by default. Dark-theme colors are an original adaptation
  of the design's brand palette (the source file is light-only).
- **4 languages** — English, French, Russian, and Arabic (full RTL), switchable
  from the header. Arabic mirrors the entire layout (nav, reservation card,
  carousels, footer) via CSS logical properties + `dir="rtl"`, not just text.
- **Functional reservation widget** — a real check-in/check-out date-range
  calendar (two-month view, night count, min-date guard) and a rooms/guests
  picker (add/remove rooms, adult/children steppers), both built from scratch
  to match the design's popovers.
- **Working carousels** for "Special offers" and "News", with RTL-aware
  scroll direction and idle auto-play that yields to the visitor — it pauses on
  hover, on keyboard focus, after any manual interaction, when scrolled out of
  view, while the tab is in the background, and never starts at all under
  `prefers-reduced-motion` (WCAG 2.2.2).
- **Motion layer** — see below.
- Accessible: skip-to-content link, aria-labels on icon-only controls,
  keyboard-dismissible popovers (Escape / click-outside), semantic landmarks.

## Project structure

```
src/
  app/
    [locale]/
      layout.tsx        # root layout: fonts, ThemeProvider, header/footer
      page.tsx           # composes the home page sections
    globals.css          # design tokens (colors, fonts) + Tailwind v4 theme
    proxy.ts (middleware) # locale detection/routing
  components/
    site-header.tsx
    site-footer.tsx
    theme-toggle.tsx / theme-provider.tsx
    language-switcher.tsx
    icons/social-icons.tsx
    home/
      hero-section.tsx
      reservation-widget.tsx
      date-range-calendar.tsx
      guests-popover.tsx
      scroll-carousel.tsx
      special-offers-section.tsx
      news-section.tsx
  i18n/                   # next-intl routing/navigation config
  lib/
    date.ts               # date-range/calendar-grid helpers
    use-click-outside.ts
messages/
  en.json / fr.json / ru.json / ar.json
```

## Notes / next steps

- The hero, offer, and news photography are the actual images exported from
  the Figma file (`public/images/`), wired in via `next/image` in
  `hero-section.tsx`, `special-offers-section.tsx` and `news-section.tsx`.
  The special-offers cards currently all reuse `coffe.jpg`; swap in the other
  two exported offer photos there if/when they're exported.
- The hero/footer wave uses the exact vector path exported from the design
  (`src/components/wave-divider.tsx`); the footer instance is the same path
  vertically mirrored, matching Figma's `matrix(1, 0, 0, -1, 0, 0)`.

## Animation

Built on [Motion](https://motion.dev) (Framer Motion), loaded through
`LazyMotion` + `domAnimation` so only ~18kb of the library ships instead of the
full bundle. A single `MotionConfig` sets `reducedMotion="user"`, which means
**every** animation in the tree honours `prefers-reduced-motion` without any
per-component guards.

Rather than scattering one-off animations, the motion vocabulary lives in
`src/components/motion/` and is reused everywhere:

| Primitive | Purpose |
| --- | --- |
| `Reveal` | Scroll-triggered entrance (direction, delay, optional blur-in) |
| `StaggerGroup` / `StaggerItem` | Parent owns the timing, child owns the movement |
| `AnimatedText` | Section headings drop in **letter by letter** on scroll |
| `WavyText` | Offer titles bounce in a travelling wave under a rainbow gradient |
| `Pressable` / `Magnetic` | Hover/press feedback and cursor-following magnetism |

Where it's used: hero Ken Burns push-in + scroll parallax, letter-by-letter
headline, magnetic badges, the reservation panel rising into place, spring-based
popover enter/exit, per-card reveals, animated expand/collapse in both
carousels, a condensing header with sliding nav underlines, a rotating
theme-toggle swap, and staggered footer columns.

### Performance

Measured against the running production build (`next start`), not estimated:

| | Before | After |
| --- | --- | --- |
| Images on disk | 2.37 MB | **584 KB** (−76%) |
| `news1-3` (photos as PNG) | 1.78 MB | **128 KB** (−93%) |
| Font files | 4 families' worth | **2 files, 86 KB** |
| HTML (gzip) | 12.9 KB | 13.7 KB |
| JS (gzip) | 258 KB | 258 KB |

What actually moved the needle, in order:

1. **Photos were stored as PNG.** `news1-3.png` were 1.78 MB of photographic
   content in a lossless format, at 828px wide for cards that render at
   328–582px. Re-encoded to WebP at sensible dimensions: 566 KB → 45 KB,
   607 KB → 35 KB, 606 KB → 48 KB. AVIF is enabled in `next.config.ts` so
   `next/image` serves something smaller again where the browser supports it.
2. **`sizes` hints were too generous** — the News cards claimed `50vw` when they
   never exceed 582px, so browsers fetched a larger variant than needed.
3. **A whole font family was dead weight.** The wordmark moved to the exported
   logo image, which left Lato (2 weights) downloading for nothing. Removed.
4. **A universal `* { transition: ... }` rule** made the style engine track
   transitions on every node — including the ~90 per-letter spans the animated
   headings generate. Removed in favour of the explicit `transition-colors`
   utilities components already carry.
5. **The per-letter wave moved from JS to CSS.** ~110 glyphs each running their
   own JS animation loop visibly stuttered; as a keyframe animation with a
   staggered negative `animation-delay` it is compositor-owned and costs
   effectively nothing per frame.

Measured and reverted: loading the two carousels via `next/dynamic` *increased*
JS by ~8 KB. In the App Router these still render on the server, so Next
preloads their chunks anyway and the only net effect was extra indirection.

The remaining 258 KB is dominated by React/React-DOM plus next-intl's ICU
formatter; meaningfully reducing it would mean rendering the translated copy in
Server Components and hydrating only the interactive shells, which is the next
thing worth doing if the budget demanded it.

### Correctness decisions

These were deliberate, and the reasoning is worth calling out:

- **The rainbow is one CSS gradient per letter, not a JS colour animation.**
  Animating `color` on ~75 spans repaints every frame; a `background-position`
  pan on a gradient clipped to the glyphs does not. Each letter carries its own
  gradient with a staggered negative `animation-delay` — necessary because a
  transformed child paints in its own layer, which severs `background-clip:
  text` inherited from an ancestor and renders the glyph invisible.
- **Animations pause off-screen** (`data-in-view`), so nothing burns frames in
  a section nobody is looking at.
- **Cursive scripts are never split per glyph.** Arabic would lose its letter
  joining, so `AnimatedText` / `WavyText` fall back to word-level splitting.
  Split text is `aria-hidden` with the full string on `aria-label`, so screen
  readers hear a sentence, not a stream of characters.
- **Carousel stepping** advances exactly one card. Three issues had to be
  solved: measuring the delta from the target card (scrolling by a fraction of
  the viewport overshot and let snap fling to an end); suspending
  `scroll-snap-type` during the tween (mandatory snapping cancels programmatic
  scrolls); and tweening `scrollLeft` via Motion instead of
  `behavior: "smooth"`, which is a no-op wherever the platform disables smooth
  scrolling. The track also uses `snap-proximity` rather than `snap-mandatory`,
  because with mandatory snapping the last card can never align to the start
  edge and gets dragged back.

### How the design spec was applied

Values were taken from Figma's "Copy as code → CSS (all layers)" output for each
frame, so colors, type, radii, spacing and component states are the design's own
numbers rather than estimates — for example `#0B2654` → `#173A74` on the search
button's hover state, the 582/328px News card widths, the 711×535 offer cards,
and the 95×85 search button. Because that CSS is absolutely positioned and
desktop-only, the exact values are applied from the `xl` breakpoint up; tablet
and mobile layouts below it are original responsive work, as is the whole
dark theme and the 4-language/RTL layer.
