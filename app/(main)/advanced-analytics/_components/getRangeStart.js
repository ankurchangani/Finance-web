import { subDays, subMonths } from "date-fns";

/**
 * Returns the start Date for the given range, or null for "ALL".
 * @param {string} range - "7D" | "30D" | "90D" | "6M" | "1Y" | "ALL"
 * @returns {Date | null}
 */
export function getRangeStart(range) {
  const now = new Date();
  const map = {
    "7D":  subDays(now, 7),
    "30D": subDays(now, 30),
    "90D": subDays(now, 90),
    "6M":  subMonths(now, 6),
    "1Y":  subMonths(now, 12),
  };
  return map[range] ?? null;
}
