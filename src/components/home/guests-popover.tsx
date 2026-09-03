"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, MinusCircle, PlusCircle, Trash2, BedSingle } from "lucide-react";

export type Room = {
  id: string;
  adults: number;
  children: number;
};

type Props = {
  rooms: Room[];
  onConfirm: (rooms: Room[]) => void;
};

let roomIdCounter = 0;
function nextRoomId() {
  roomIdCounter += 1;
  return `room-${roomIdCounter}`;
}

/** Figma "guest and room": 391x485, radius 8, rows #F8FAFC/#E3E8EF, steppers 32px. */
function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-[18px]">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="text-[#364152] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 dark:text-foreground"
      >
        <MinusCircle className="h-8 w-8" strokeWidth={1.5} />
      </button>
      <span className="min-w-[13px] text-center text-[20px] font-medium leading-6 tabular-nums text-[#364152] dark:text-foreground">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="text-[#364152] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 dark:text-foreground"
      >
        <PlusCircle className="h-8 w-8" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function GuestsPopover({ rooms: initialRooms, onConfirm }: Props) {
  const t = useTranslations("GuestsPicker");
  const [rooms, setRooms] = useState(initialRooms);
  const [expandedId, setExpandedId] = useState<string | null>(
    initialRooms.at(-1)?.id ?? null,
  );

  function updateRoom(id: string, patch: Partial<Room>) {
    setRooms((prev) =>
      prev.map((room) => (room.id === id ? { ...room, ...patch } : room)),
    );
  }

  function removeRoom(id: string) {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  }

  function addRoom() {
    const room: Room = { id: nextRoomId(), adults: 2, children: 0 };
    setRooms((prev) => [...prev, room]);
    setExpandedId(room.id);
  }

  return (
    <div className="w-[min(92vw,391px)] rounded-[8px] bg-surface shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)]">
      <div className="flex h-[52px] items-center border-b border-[#E3E8EF] px-4 py-2 dark:border-border">
        <h3 className="text-[18px] font-semibold leading-[22px] tracking-[-0.03em] text-[#202939] dark:text-foreground">
          {t("title")}
        </h3>
      </div>

      <div className="max-h-[55vh] space-y-2.5 overflow-y-auto p-4">
        {rooms.map((room, index) => {
          const isExpanded = expandedId === room.id;
          return (
            <div key={room.id}>
              <div
                className={`flex h-[55px] items-center justify-between gap-4 border border-[#E3E8EF] bg-[#F8FAFC] px-4 py-[18px] dark:border-border dark:bg-surface-muted ${
                  isExpanded ? "rounded-t-[8px] border-b-0" : "rounded-[8px]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : room.id)}
                  aria-expanded={isExpanded}
                  className="flex flex-1 items-center justify-between gap-4 text-start"
                >
                  <span className="text-base font-semibold leading-5 text-[#364152] dark:text-foreground">
                    {t("room", { n: index + 1 })}
                  </span>
                  <span className="text-base leading-5 text-[#697586] dark:text-text-muted">
                    {t("adults")}: {room.adults} · {t("children")}: {room.children}
                  </span>
                </button>
                {rooms.length > 1 && (
                  <>
                    <span
                      aria-hidden
                      className="h-[23px] w-0.5 shrink-0 bg-[#CDD5DF] dark:bg-border"
                    />
                    <button
                      type="button"
                      aria-label={t("removeRoom")}
                      onClick={() => removeRoom(room.id)}
                      className="shrink-0 text-[#364152] transition-colors hover:text-red-500 dark:text-foreground"
                    >
                      <Trash2 className="h-6 w-6" strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>

              {isExpanded && (
                <div className="rounded-b-[8px] border border-t-0 border-[#E3E8EF] bg-surface px-[22px] py-6 dark:border-border">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-base font-semibold leading-6 text-[#4B5565] dark:text-foreground">
                        {t("adults")}
                      </div>
                      <div className="text-base font-light leading-5 text-[#697586] dark:text-text-muted">
                        {t("adultsAge")}
                      </div>
                    </div>
                    <Stepper
                      label={t("adults")}
                      value={room.adults}
                      min={1}
                      max={8}
                      onChange={(v) => updateRoom(room.id, { adults: v })}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-base font-semibold leading-6 text-[#4B5565] dark:text-foreground">
                        {t("children")}
                      </div>
                      <div className="text-base font-light leading-5 text-[#697586] dark:text-text-muted">
                        {t("childrenAge")}
                      </div>
                    </div>
                    <Stepper
                      label={t("children")}
                      value={room.children}
                      min={0}
                      max={6}
                      onChange={(v) => updateRoom(room.id, { children: v })}
                    />
                  </div>

                  {room.children > 0 && (
                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#E3E8EF] pt-4 dark:border-border">
                      <span className="text-base leading-5 text-[#364152] dark:text-foreground">
                        {t("ageOfChild", { count: room.children })}
                      </span>
                      <button
                        type="button"
                        className="flex h-12 items-center gap-4 rounded-[8px] bg-surface px-4 py-3 text-base leading-5 text-[#364152] transition-colors hover:bg-surface-muted dark:text-foreground"
                      >
                        {t("select")}
                        <ChevronDown className="h-5 w-5" aria-hidden />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Figma: two 173.5x48 buttons, 12px gap */}
      <div className="flex items-center gap-3 px-[18px] pb-[18px]">
        <button
          type="button"
          onClick={addRoom}
          className="inline-flex h-12 flex-1 items-center justify-center gap-3 rounded-[8px] border border-brand bg-surface text-base font-medium capitalize leading-6 text-brand shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:bg-outline-hover"
        >
          <BedSingle className="h-6 w-6" strokeWidth={1.5} />
          {t("addRoom")}
        </button>
        <button
          type="button"
          onClick={() => onConfirm(rooms)}
          className="h-12 flex-1 rounded-[8px] bg-brand text-base font-medium capitalize leading-6 text-white transition-colors hover:bg-brand-hover"
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
}
