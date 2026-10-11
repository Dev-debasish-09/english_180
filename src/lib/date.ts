// Small date helpers. We always work with plain "YYYY-MM-DD" strings for
// storage and comparisons, so that time-of-day and timezone shifts never
// change which calendar day something belongs to.

export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, amount: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + amount);
  return toISODate(d);
}

// Whole number of days between two "YYYY-MM-DD" dates (b - a).
export function diffInDays(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const da = parseISODate(a).getTime();
  const db = parseISODate(b).getTime();
  return Math.round((db - da) / msPerDay);
}

// The 7 dates (Monday to Sunday) of the week containing `reference`.
export function getWeekDates(reference: string): string[] {
  const d = parseISODate(reference);
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    dates.push(toISODate(day));
  }
  return dates;
}
