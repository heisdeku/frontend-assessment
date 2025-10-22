import {
  addDays,
  differenceInDays,
  endOfMonth,
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
  startOfMonth,
  subDays,
} from "date-fns";

export function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function groupBy<T, K extends string | number>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export const formatDate = (date: Date) => {
  return format(date, "MMM dd, yyyy HH:mm");
};

export const formatTransactionDate = (date: Date): string => {
  return format(date, "PPpp");
};

export const getDateRange = (months: number = 1) => {
  const now = new Date();
  return {
    start: startOfMonth(subDays(now, months * 30)),
    end: endOfMonth(addDays(now, 7)),
  };
};

export const parseDate = (dateString: string) => {
  const parsed = parseISO(dateString);
  return isValid(parsed) ? parsed : new Date();
};

export const getRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const daysBetween = (start: Date, end: Date): number => {
  return differenceInDays(end, start);
};

export const generateDateArray = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  let current = start;

  while (current <= end) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
};

export const formatCurrency = (amount: number, locale: string = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number, locale: string = "en-US") => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatCurrencyByCode = (
  amount: number,
  currency: string,
  locale: string = "en-US"
) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return formatCurrency(amount, locale);
  }
};
