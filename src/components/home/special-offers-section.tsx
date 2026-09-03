import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ScrollCarousel } from "@/components/home/scroll-carousel";

const CARD_GRADIENTS = [
  "from-[#3a2e1f] via-[#6b5330] to-[#c6a15c]",
  "from-[#1f2e3a] via-[#30506b] to-[#5c8bc6]",
  "from-[#2e1f3a] via-[#53306b] to-[#a15cc6]",
];

type OfferItem = {
  duration: string;
  title: string;
  description: string;
};

export function SpecialOffersSection() {
  const t = useTranslations("Offers");
  const items = t.raw("items") as OfferItem[];

  return (
    <section className="bg-background py-16 lg:py-20 xl:py-[60px]">
      <div className="mx-auto px-4 sm:px-6 lg:px-10 ">
        <ScrollCarousel
          title={
            // Figma: Unbounded 400, 36px/38px, #222222, centred
            <h2 className="font-display text-[26px] font-normal leading-[38px] text-[#222222] dark:text-foreground sm:text-[36px]">
              {t("sectionTitle")}
            </h2>
          }
          previousLabel={t("previous")}
          nextLabel={t("next")}
        >
          {items.map((item, i) => (
            <article
              key={item.title}
              // Figma: 711 x 535, radius 20, gap 48 between cards.
              className="group relative h-[300px] w-[85vw] shrink-0 snap-start overflow-hidden rounded-[20px] sm:h-[420px] sm:w-[560px] xl:h-[535px] xl:w-[711px]"
            >
              <div
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} transition-transform duration-500 group-hover:scale-105`}
              />
              {/* Figma: gradient starts at the vertical midpoint, not the top. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-b from-black/0 to-black/80"
              />

              <span className="absolute start-[22px] top-[21px] flex h-8 items-center justify-center rounded-[50px] bg-white px-4 text-[13px] font-semibold uppercase leading-5 text-text-heading">
                {item.duration}
              </span>

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 xl:ps-[33px] xl:pb-[46px]">
                <h3 className="font-display text-[22px] font-semibold leading-[34px] tracking-[-0.78px] text-white sm:text-[28px]">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="line-clamp-2 text-sm uppercase text-white/80">
                    {item.description}
                  </p>
                )}
                <Link
                  href="/"
                  className="mt-2 inline-flex h-12 w-fit items-center justify-center rounded-[10px] bg-accent px-4 text-base text-white transition-colors hover:bg-accent-hover"
                >
                  {t("bookNow")}
                </Link>
              </div>
            </article>
          ))}
        </ScrollCarousel>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="rounded-[10px] border border-accent px-8 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            {t("allOffers")}
          </Link>
        </div>
      </div>
    </section>
  );
}
