"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Search, Users } from "lucide-react";
import { addDays, formatDate } from "@/lib/date";
import { useClickOutside } from "@/lib/use-click-outside";
import { DateRangeCalendar } from "@/components/home/date-range-calendar";
import { GuestsPopover, type Room } from "@/components/home/guests-popover";

type OpenPanel = "dates" | "guests" | null;

function makeDefaultRooms(): Room[] {
  return [
    { id: "room-1", adults: 2, children: 0 },
    { id: "room-2", adults: 2, children: 0 },
  ];
}

export function ReservationWidget() {
  const t = useTranslations("Reservation");
  const locale = useLocale();

  const today = new Date();
  const [checkIn, setCheckIn] = useState(() => addDays(today, 7));
  const [checkOut, setCheckOut] = useState(() => addDays(today, 8));
  const [rooms, setRooms] = useState<Room[]>(makeDefaultRooms);
  const [open, setOpen] = useState<OpenPanel>(null);

  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useClickOutside([datesRef], () => setOpen(null), open === "dates");
  useClickOutside([guestsRef], () => setOpen(null), open === "guests");

  const adultsTotal = rooms.reduce((sum, r) => sum + r.adults, 0);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: in a real app this would navigate to a search-results route.
  }

  return (
    <form
      onSubmit={handleSearch}
      className="relative z-10 mx-auto -mt-16 w-full max-w-[1320px] rounded-[20px] bg-surface-muted p-5 shadow-xl sm:p-6 lg:-mt-[105px] xl:p-[25px]"
    >
      {/* Figma: inner row 1270x85, 10px gap; fields are white cards on the #F5F5F5 panel */}
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-stretch">
        <div className="flex w-full shrink-0 flex-col justify-center gap-[7px] lg:w-[260px]">
          <h2 className="font-display text-[24px] font-semibold leading-[30px] text-text-heading">
            {t("title")}
          </h2>
          <p className="text-[15px] font-semibold leading-[18px] text-text-subtle">
            {t("subtitle")}
          </p>
        </div>

        <div
          ref={datesRef}
          className="relative flex flex-1 flex-col sm:flex-row xl:w-[590px] xl:flex-none"
        >
          <button
            type="button"
            onClick={() => setOpen(open === "dates" ? null : "dates")}
            className="flex flex-1 items-center justify-between gap-2 rounded-t-[10px] bg-surface px-[19px] py-[22px] text-start shadow-[0px_1px_4px_rgba(12,12,13,0.05)] transition-colors hover:bg-surface-muted sm:rounded-s-[10px] sm:rounded-e-none sm:border-e sm:border-[#F4F4F4] dark:sm:border-border"
          >
            <span>
              <span className="block text-base font-light leading-5 text-text-field">
                {t("checkIn")}
              </span>
              <span className="text-[20px] font-semibold leading-6 text-text-field">
                {formatDate(checkIn, locale)}
              </span>
            </span>
            <CalendarDays className="h-[30px] w-[30px] shrink-0 text-[#A0A0A0]" aria-hidden />
          </button>

          <button
            type="button"
            onClick={() => setOpen(open === "dates" ? null : "dates")}
            className="flex flex-1 items-center justify-between gap-2 rounded-b-[10px] bg-surface px-[21px] py-[22px] text-start shadow-[0px_1px_4px_rgba(12,12,13,0.05)] transition-colors hover:bg-surface-muted sm:rounded-e-[10px] sm:rounded-s-none"
          >
            <span>
              <span className="block text-base font-light leading-5 text-text-field">
                {t("checkOut")}
              </span>
              <span className="text-[20px] font-semibold leading-6 text-text-field">
                {formatDate(checkOut, locale)}
              </span>
            </span>
            <CalendarDays className="h-[30px] w-[30px] shrink-0 text-[#A0A0A0]" aria-hidden />
          </button>

          {open === "dates" && (
            <div className="absolute start-0 top-full z-20 mt-3">
              <DateRangeCalendar
                checkIn={checkIn}
                checkOut={checkOut}
                onConfirm={({ checkIn: nextIn, checkOut: nextOut }) => {
                  setCheckIn(nextIn);
                  setCheckOut(nextOut);
                  setOpen(null);
                }}
              />
            </div>
          )}
        </div>

        <div ref={guestsRef} className="relative flex-1 xl:w-[295px] xl:flex-none">
          <button
            type="button"
            onClick={() => setOpen(open === "guests" ? null : "guests")}
            className="flex h-full w-full items-center justify-between gap-2 rounded-[10px] bg-surface px-[22px] py-5 text-start shadow-[0px_1px_4px_rgba(12,12,13,0.05)] transition-colors hover:bg-surface-muted"
          >
            <span>
              <span className="block text-base font-light leading-5 text-text-field">
                {t("guests")}
              </span>
              <span className="text-[20px] font-semibold leading-6 text-text-field">
                {t("guestsSummary", { rooms: rooms.length, adults: adultsTotal })}
              </span>
            </span>
            <Users className="h-[30px] w-[30px] shrink-0 text-[#A0A0A0]" aria-hidden />
          </button>

          {open === "guests" && (
            <div className="absolute end-0 top-full z-20 mt-3">
              <GuestsPopover
                rooms={rooms}
                onConfirm={(nextRooms) => {
                  setRooms(nextRooms.length ? nextRooms : makeDefaultRooms());
                  setOpen(null);
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          aria-label={t("search")}
          className="flex h-[69px] w-full shrink-0 items-center justify-center rounded-[10px] bg-brand text-white transition-colors hover:bg-brand-hover lg:h-auto lg:w-[95px] lg:self-stretch"
        >
          {/* Figma mobile variant: 326x69, uppercase 24px label, no icon */}
          <span className="text-[24px] font-semibold uppercase leading-5 lg:hidden">
            {t("search")}
          </span>
          <Search className="hidden lg:block lg:h-[30px] lg:w-[30px]" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
