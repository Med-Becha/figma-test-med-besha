"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Moon } from "lucide-react";
import {
  diffInDays,
  formatMonthYear,
  getMonthGrid,
  getWeekdayLabels,
  isBefore,
  isSameDay,
  isWithinRange,
  startOfDay,
} from "@/lib/date";

type Props = {
  checkIn: Date;
  checkOut: Date;
  onConfirm: (range: { checkIn: Date; checkOut: Date }) => void;
};

/**
 * Styling mirrors the Figma "Calendar" component:
 * 850x558, radius 7.82, 57.93px square day cells bordered #F0F2F5,
 * selected #254478, in-range #EEF2FA/#E4E8EF, weekend headers #F04438.
 */
export function DateRangeCalendar({ checkIn, checkOut, onConfirm }: Props) {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [draftIn, setDraftIn] = useState(checkIn);
  const [draftOut, setDraftOut] = useState(checkOut);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [cursor, setCursor] = useState(
    new Date(checkIn.getFullYear(), checkIn.getMonth(), 1),
  );

  const weekdays = useMemo(() => getWeekdayLabels(locale), [locale]);
  const months = useMemo(
    () => [cursor, new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)],
    [cursor],
  );

  function handlePick(date: Date) {
    if (isBefore(date, today)) return;

    if (!selectingEnd || isBefore(date, draftIn)) {
      setDraftIn(date);
      setDraftOut(date);
      setSelectingEnd(true);
      return;
    }

    setDraftOut(date);
    setSelectingEnd(false);
  }

  const nights = diffInDays(draftIn, draftOut);
  const shortDate = (d: Date) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(d);

  return (
    <div className="w-[min(92vw,850px)] rounded-[8px] bg-surface shadow-[0px_3.9px_7.8px_-1.95px_rgba(16,24,40,0.1),0px_1.95px_3.9px_-1.95px_rgba(16,24,40,0.06)]">
      {/* Interval bar — Figma: 850x80, split panel with the nights pill centred */}
      <div className="px-4 py-2">
        <div className="relative flex h-16 items-stretch">
          <div className="flex flex-1 flex-col justify-center rounded-s-[8px] border border-brand/60 bg-gradient-to-r from-brand/10 to-surface-muted ps-4">
            <span className="text-xs leading-[15px] text-[#4B5565] dark:text-text-muted">
              {t("checkIn")}
            </span>
            <span className="text-sm font-semibold leading-[17px] text-[#202939] dark:text-foreground">
              {shortDate(draftIn)}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-end justify-center rounded-e-[8px] border border-s-0 border-[#CFD5DD] bg-[#F8F8FA] pe-4 dark:border-border dark:bg-surface-muted">
            <span className="text-xs leading-[15px] text-[#697586] dark:text-text-muted">
              {t("checkOut")}
            </span>
            <span className="text-sm font-semibold leading-[17px] text-[#202939] dark:text-foreground">
              {shortDate(draftOut)}
            </span>
          </div>
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[8px] border border-brand bg-surface p-2 text-xs leading-[15px] text-[#4B5565] dark:text-text-muted">
            <Moon className="h-3.5 w-3.5" aria-hidden />
            {t("nights", { count: nights })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-4 pb-2 sm:grid-cols-2">
        {months.map((month, idx) => (
          <div key={month.toISOString()}>
            <div className="mb-3 flex items-center justify-between">
              {idx === 0 ? (
                <button
                  type="button"
                  aria-label={t("previousMonth")}
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
                    )
                  }
                  className="inline-flex h-[31px] w-[31px] items-center justify-center rounded-full border border-[#012937] text-[#012937] transition-colors hover:bg-surface-muted dark:border-border dark:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                </button>
              ) : (
                <span className="h-[31px] w-[31px]" />
              )}
              <span className="text-base font-semibold leading-5 text-[#344054] dark:text-foreground">
                {formatMonthYear(month, locale)}
              </span>
              {idx === 1 ? (
                <button
                  type="button"
                  aria-label={t("nextMonth")}
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
                    )
                  }
                  className="inline-flex h-[27px] w-[27px] items-center justify-center rounded-full border border-[#012937] text-[#012937] transition-colors hover:bg-surface-muted dark:border-border dark:text-foreground"
                >
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              ) : (
                <span className="h-[27px] w-[27px]" />
              )}
            </div>

            <div className="grid grid-cols-7 text-center">
              {weekdays.map((w, i) => (
                <div
                  key={w}
                  className={`py-3 text-xs font-semibold leading-[15px] ${
                    i >= 5
                      ? "text-[#F04438]"
                      : "text-black dark:text-foreground"
                  }`}
                >
                  {w}
                </div>
              ))}
              {getMonthGrid(month.getFullYear(), month.getMonth()).map(
                (date) => {
                  const inMonth = date.getMonth() === month.getMonth();
                  const disabled = isBefore(date, today);
                  const isStart = isSameDay(date, draftIn);
                  const isEnd = isSameDay(date, draftOut);
                  const inRange = isWithinRange(date, draftIn, draftOut);
                  const selected = isStart || isEnd;

                  return (
                    <button
                      type="button"
                      key={date.toISOString()}
                      disabled={disabled || !inMonth}
                      onClick={() => handlePick(date)}
                      className={[
                        "aspect-square border text-sm font-semibold leading-5 transition-colors",
                        !inMonth ? "invisible" : "",
                        selected
                          ? "border-[#F0F2F5] bg-[#254478] text-white dark:border-border"
                          : inRange
                            ? "border-[#E4E8EF] bg-[#EEF2FA] text-[#344054] dark:border-border dark:bg-brand/20 dark:text-foreground"
                            : "border-[#F0F2F5] text-[#344054] dark:border-border dark:text-foreground",
                        disabled
                          ? "cursor-not-allowed text-[#98A2B3] dark:text-text-muted"
                          : !selected
                            ? "hover:bg-surface-muted"
                            : "",
                      ].join(" ")}
                    >
                      {date.getDate()}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm — Figma: 100x47, #0B2654, radius 7.82 */}
      <div className="flex justify-end border-t border-border px-4 py-4">
        <button
          type="button"
          onClick={() => onConfirm({ checkIn: draftIn, checkOut: draftOut })}
          className="h-[47px] w-[100px] rounded-[8px] bg-brand text-base font-medium capitalize leading-[23px] text-white transition-colors hover:bg-brand-hover"
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
}
