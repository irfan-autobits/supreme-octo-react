// project/src/utils/time.tsx
/**
 * Format a Date as "MMM dd, yyyy, hh:mm" in the user’s locale.
 */
export function formatShort(date: Date): string {
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

/**
 * Format a Date as "MMM dd, yyyy, hh:mm" in the user’s locale.
 * Identical to formatShort but keeps your previous name.
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
