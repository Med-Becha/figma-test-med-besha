import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  InstagramIcon,
  TelegramIcon,
  TikTokIcon,
  XIcon,
} from "@/components/icons/social-icons";
import { WaveDivider } from "@/components/wave-divider";

const SOCIALS = [
  { Icon: InstagramIcon, label: "Instagram" },
  { Icon: TelegramIcon, label: "Telegram" },
  { Icon: TikTokIcon, label: "TikTok" },
  { Icon: XIcon, label: "X" },
];

const PAYMENT_CARDS = ["VISA", "MC", "JCB", "AMEX", "UPI"];

/**
 * Figma "footer" (1920x801):
 * outer padding 50px 24px, navy block #00366B 1870px wide with 20px radius on the
 * (flipped) bottom corners and the white wave on top, bottom bar padding 30px 300px.
 */
export function SiteFooter() {
  const t = useTranslations("Footer");
  const menuItems = t.raw("menuItems") as string[];
  const hotelsItems = t.raw("hotelsItems") as string[];

  return (
    <footer className="bg-background">
      <div className="px-4 pt-6 sm:px-6 lg:px-6 xl:px-[24px] xl:pt-[50px]">
        <div className="relative mx-auto max-w-[1870px] overflow-hidden rounded-b-[20px] bg-brand-deep pb-14 pt-20 text-white xl:pb-[50px] xl:pt-[100px]">
          {/* same wave as the hero, vertically mirrored (Figma applies matrix(1,0,0,-1,0,0)) */}
          <WaveDivider placement="top" />

          {/* Fixed Figma column widths only kick in at xl; below that the grid is fluid. */}
          <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 xl:grid-cols-[238px_178px_303px_auto] xl:gap-x-16 xl:px-[165px]">
            <div className="flex flex-col gap-6">
              {/* Figma footer logo: 72.1px mark + 132.2px wordmark, white */}
              <Link href="/" className="flex items-center" aria-label="THANOS">
                <Image
                  src="/images/logo-marhaba-light.png"
                  alt="THANOS — Personal Trainer"
                  width={193}
                  height={71}
                  className="h-[56px] w-auto brightness-0 invert xl:h-[72px]"
                />
              </Link>

              <div className="flex flex-col gap-6">
                <h3 className="font-display text-[18px] font-normal leading-6 text-white">
                  {t("accessYourSpace")}
                </h3>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/"
                    className="inline-flex h-[46px] w-full max-w-[238px] items-center justify-center gap-2 rounded-[12px] border border-white px-[21px] text-base leading-6 transition-colors hover:bg-white/10"
                  >
                    {t("agentPortal")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex h-[46px] w-full max-w-[238px] items-center justify-center gap-2 rounded-[12px] border border-white px-[21px] text-base leading-6 transition-colors hover:bg-white/10"
                  >
                    {t("corporatePortal")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </div>

            <nav aria-label={t("menuTitle")}>
              <h3 className="font-display text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-white">
                {t("menuTitle")}
              </h3>
              <ul className="mt-4 flex flex-col text-[18px] leading-[174%] tracking-[-0.03em] text-white">
                {menuItems.map((item) => (
                  <li key={item}>
                    <Link href="/" className="transition-opacity hover:opacity-75">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={t("hotelsTitle")}>
              <h3 className="font-display text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-white">
                {t("hotelsTitle")}
              </h3>
              <ul className="mt-4 flex flex-col text-[18px] leading-[174%] tracking-[-0.03em] text-white">
                {hotelsItems.map((item) => (
                  <li key={item}>
                    <Link href="/" className="transition-opacity hover:opacity-75">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-6 sm:items-end">
              {/* Figma: 36x36 links, radius 12, first one filled white */}
              <div className="flex items-center gap-2">
                {SOCIALS.map(({ Icon, label }, i) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-[12px] p-1.5 transition-colors ${
                      i === 0
                        ? "bg-white text-brand-deep hover:bg-white/90"
                        : "border border-white text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>

              {/* Figma: 58x40 payment tiles, radius 12, 8px gap */}
              <div className="flex max-w-[246px] flex-wrap gap-2 sm:justify-end" aria-hidden>
                {PAYMENT_CARDS.map((card) => (
                  <span
                    key={card}
                    className="flex h-10 w-[58px] items-center justify-center rounded-[12px] bg-white/80 text-[10px] font-bold tracking-wide text-brand-deep"
                  >
                    {card}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Figma "Footer" bar: padding 30px 300px, text #2A2A2A 16px/24 */}
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-[300px]">
        <div className="flex flex-col gap-3 py-6 text-base leading-6 text-[#2A2A2A] sm:flex-row sm:items-center sm:justify-between dark:text-text-muted xl:py-[30px]">
          <p>{t("copyright")}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/" className="px-2 hover:text-foreground">
              {t("terms")}
            </Link>
            <Link href="/" className="px-2 hover:text-foreground">
              {t("cancellations")}
            </Link>
            <Link href="/" className="px-2 hover:text-foreground">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
