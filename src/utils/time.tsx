// src/utils/time.tsx
/**
 * Format a Date as "MMM dd, yyyy, hh:mm" in the user’s locale.
 *  or formatShort
*/
export function formatTimestamp(date: Date): string {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Convert a local‑only "YYYY-MM-DDThh:mm" string into a full UTC ISO timestamp.
 * e.g. '2025-05-01T14:30' → '2025-05-01T14:30:00.000Z'
 */
export function localToUtcIso(localStr: string): string {
  // Date treats the string as local time, toISOString() returns the UTC Z version
  return new Date(localStr).toISOString();
}

/**
 * Parse an ISO timestamp (or epoch ms) into a Date.
 */
export function parseTimestamp(input: string | number): Date {
  return typeof input === 'number' ? new Date(input) : new Date(input);
}

/** Converts a JS Date or ISO string to a UTC start-of-day ISO string */
export function toUTCStart(date: string | Date): string {
  const d = new Date(date);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)).toISOString();
}

/** Converts a JS Date or ISO string to a UTC end-of-day ISO string */
export function toUTCEnd(date: string | Date): string {
  const d = new Date(date);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)).toISOString();
}

/** Returns whether two dates fall on the same calendar day */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
