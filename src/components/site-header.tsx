"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

const MENU_COUNT = 7;

export function SiteHeader() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const menuItems = Array.from({ length: MENU_COUNT }, (_, i) => i + 1);

  // Figma: 91px tall, nav padding 10px 300px, background rgba(255, 255, 255, 0.7)
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/70 backdrop-blur">
      <div className="mx-auto flex h-[72px] w-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:h-[91px] ">
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
            {menuItems.map((n) => (
              <Link
                key={n}
                href="/"
                className={
                  n === 1
                    ? "font-semibold text-brand"
                    : "text-text-muted transition-colors hover:text-brand"
                }
              >
                {t("menu")} {n}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 hover:bg-surface-muted lg:hidden"
            >
              {open ? (
                <X className="h-4.5 w-4.5" />
              ) : (
                <Menu className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-4 py-4 sm:px-6 lg:hidden">
          <nav aria-label="Primary" className="flex flex-col gap-1">
            {menuItems.map((n) => (
              <Link
                key={n}
                href="/"
                onClick={() => setOpen(false)}
                className={
                  n === 1
                    ? "rounded-lg px-3 py-2 text-sm font-semibold text-brand"
                    : "rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-surface-muted hover:text-brand"
                }
              >
                {t("menu")} {n}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 sm:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
