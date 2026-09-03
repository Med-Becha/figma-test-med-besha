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
  scroll direction.
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

### How the design spec was applied

Values were taken from Figma's "Copy as code → CSS (all layers)" output for each
frame, so colors, type, radii, spacing and component states are the design's own
numbers rather than estimates — for example `#0B2654` → `#173A74` on the search
button's hover state, the 582/328px News card widths, the 711×535 offer cards,
and the 95×85 search button. Because that CSS is absolutely positioned and
desktop-only, the exact values are applied from the `xl` breakpoint up; tablet
and mobile layouts below it are original responsive work, as is the whole
dark theme and the 4-language/RTL layer.
