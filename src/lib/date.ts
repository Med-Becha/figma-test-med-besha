export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const t = startOfDay(date).getTime();
  return t > startOfDay(start).getTime() && t < startOfDay(end).getTime();
}

export function diffInDays(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatWeekday(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
}

export function formatMonthYear(date: Date, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
  return formatted.charAt(0).toLocaleUpperCase(locale) + formatted.slice(1);
}

/** Builds a 6x7 grid (Monday-start weeks) of dates for the given month, including leading/trailing days. */
export function getMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  // Monday = 0 ... Sunday = 6
  const firstWeekday = (first.getDay() + 6) % 7;
  const gridStart = addDays(first, -firstWeekday);

  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function getWeekdayLabels(locale: string): string[] {
  // A Monday reference date (2024-01-01 is a Monday).
  const monday = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (_, i) =>
    formatWeekday(addDays(monday, i), locale),
  );
}
