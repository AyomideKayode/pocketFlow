export const isValidPeriod = (period: string): boolean => {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(period);
};

export const normalizeDueDay = (
  year: number,
  month: number,
  day: number,
): Date => {
  // Month is 0-indexed in JS Date, but we expect 1-12 input for clarity in this utility
  // Adjusting month to 0-indexed for Date constructor
  const date = new Date(Date.UTC(year, month - 1, day));

  // If the day overflows (e.g. Feb 31 -> Mar 3), the month will be different
  // We want to clamp to the last day of the intended month
  if (date.getUTCMonth() !== month - 1) {
    // Set to day 0 of the *next* month, which is the last day of the *current* month
    return new Date(Date.UTC(year, month, 0));
  }

  return date;
};

export const getCurrentPeriod = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
