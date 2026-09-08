export const uid = (p: string): string =>
  `${p}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

export const fmtDate = (d: string | number | Date, opts?: Intl.DateTimeFormatOptions): string => {
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return "\u2014";
  return dt.toLocaleDateString("en-US", opts || { month: "short", day: "numeric", year: "numeric" });
};

export const fmtMoney = (n: number): string =>
  `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const addDays = (base: string | number | Date, n: number): Date => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

export const isoOf = (d: string | number | Date): string =>
  (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

export const initials = (name: string): string =>
  name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

export const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const randInt = (a: number, b: number): number => Math.floor(a + Math.random() * (b - a + 1));
