import { format } from "date-fns";

const SIMPLE_DATE_FORMAT = "dd/MM/yyyy";
const COMPLETE_DATE_FORMAT = "dd/MM/yyyy H:mm";

/**
 * Convert string to Date
 * @param str string or Date
 * @returns Date or null
 */
export function d(str: Date | number | string | null | undefined): Date | null {
  return str ? new Date(str) : null;
}

/**
 * Simple date, converts date to simple string format dd/mm/yyyy
 * @param date or null
 * @returns string
 */
export function sd(date: Date | number | string | null | undefined): string {
  const formattedDate = d(date);
  return formattedDate ? format(formattedDate, SIMPLE_DATE_FORMAT) : "";
}

/**
 * Complete date, converts date to simple string format dd/mm/yyyy H:mm
 * @param date or null
 * @returns string
 */
export function cd(date: Date | number | string | null | undefined): string {
  const formattedDate = d(date);
  return formattedDate ? format(formattedDate, COMPLETE_DATE_FORMAT) : "";
}
