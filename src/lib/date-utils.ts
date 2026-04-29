export function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
export function addMonths(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function formatLong(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
export function buildMonthGrid(monthStart: Date): { date: Date; inMonth: boolean }[] {
  const first = new Date(monthStart);
  const startWeekday = first.getDay(); // 0 = Sun
  const days: { date: Date; inMonth: boolean }[] = [];
  // Leading days from previous month
  for (let i = startWeekday; i > 0; i--) {
    const d = new Date(first);
    d.setDate(first.getDate() - i);
    days.push({ date: d, inMonth: false });
  }
  // Current month
  const next = new Date(first.getFullYear(), first.getMonth() + 1, 1);
  for (let d = new Date(first); d < next; d.setDate(d.getDate() + 1)) {
    days.push({ date: new Date(d), inMonth: true });
  }
  // Pad to 42 cells (6 rows)
  while (days.length < 42) {
    const last = days[days.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    days.push({ date: d, inMonth: false });
  }
  return days;
}