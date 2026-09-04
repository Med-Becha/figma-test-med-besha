"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

const MENU_COUNT = 7;

export function SiteHeader() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuItems = Array.from({ length: MENU_COUNT }, (_, i) => i + 1);

  // Condenses the bar once the page starts moving.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Figma: 91px tall, nav padding 10px 300px, background rgba(255, 255, 255, 0.7)
  return (
    <m.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "sticky top-0 z-40 border-b border-border backdrop-blur transition-shadow duration-300",
        scrolled ? "bg-surface/90 shadow-[0_4px_24px_rgba(11,38,84,0.08)]" : "bg-surface/70",
      ].join(" ")}
    >
      <m.div
        animate={{ height: scrolled ? 68 : undefined }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="mx-auto flex h-[72px] w-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:h-[91px]"
      >
        {/* Figma "logos marhba light": 193 x 71 */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={t("logoName")}
        >
          <Image
            src="/images/logo-marhaba-light.png"
            alt={`${t("logoName")} — ${t("logoTagline")}`}
            width={193}
            height={71}
            priority
            className="h-[46px] w-auto dark:brightness-0 dark:invert xl:h-[71px]"
          />
        </Link>

        {/* Figma's own header only has logo + nav, space-between with nav
            hugging the right edge — the language/theme controls are our
            addition, so they join the nav group instead of getting their own
            stretch of space. */}
        <div className="flex items-center gap-8 xl:gap-10">
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-7 text-base"
          >
            {menuItems.map((n, i) => (
              <m.div
                key={n}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.5 }}
              >
                <Link
                  href="/"
                  className={[
                    "group relative inline-block py-1",
                    n === 1
                      ? "font-semibold text-brand"
                      : "text-text-muted transition-colors hover:text-brand",
                  ].join(" ")}
                >
                  {t("menu")} {n}
                  {/* Underline grows from the inline-start edge on hover */}
                  <span
                    aria-hidden
                    className={[
                      "absolute inset-x-0 bottom-0 h-[2px] origin-[left] rounded-full bg-brand transition-transform duration-300 rtl:origin-[right]",
                      n === 1 ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    ].join(" ")}
                  />
                </Link>
              </m.div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <m.button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              whileTap={{ scale: 0.9 }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 hover:bg-surface-muted lg:hidden"
            >
              {/* Rotate-and-swap between the burger and the close glyph */}
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={open ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                </m.span>
              </AnimatePresence>
            </m.button>
          </div>
        </div>
      </m.div>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-surface lg:hidden"
          >
            <div className="px-4 py-4 sm:px-6">
              <nav aria-label="Primary" className="flex flex-col gap-1">
                {menuItems.map((n, i) => (
                  <m.div
                    key={n}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                  >
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className={
                        n === 1
                          ? "block rounded-lg px-3 py-2 text-sm font-semibold text-brand"
                          : "block rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-surface-muted hover:text-brand"
                      }
                    >
                      {t("menu")} {n}
                    </Link>
                  </m.div>
                ))}
              </nav>

              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 sm:hidden">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
