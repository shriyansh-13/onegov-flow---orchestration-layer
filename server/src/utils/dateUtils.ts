/**
 * Date Normalization Utilities
 * Converts heterogeneous date strings (DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD, etc.)
 * to normalized ISO standard: YYYY-MM-DD
 */

export function normalizeDateToISO(rawDate: string | null | undefined): string {
  if (!rawDate || typeof rawDate !== "string") {
    throw new Error(`Invalid date input: "${rawDate}"`);
  }

  const trimmed = rawDate.trim();

  // Pattern 1: Already ISO format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    validateDateValues(trimmed);
    return trimmed;
  }

  // Pattern 2: DD/MM/YYYY (Used by Identity System)
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, "0");
    const month = slashMatch[2].padStart(2, "0");
    const year = slashMatch[3];
    const iso = `${year}-${month}-${day}`;
    validateDateValues(iso);
    return iso;
  }

  // Pattern 3: DD-MM-YYYY (Used by Education System)
  const dashMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dashMatch) {
    const day = dashMatch[1].padStart(2, "0");
    const month = dashMatch[2].padStart(2, "0");
    const year = dashMatch[3];
    const iso = `${year}-${month}-${day}`;
    validateDateValues(iso);
    return iso;
  }

  throw new Error(`Unrecognized date format: "${rawDate}". Expected DD/MM/YYYY, DD-MM-YYYY, or YYYY-MM-DD.`);
}

function validateDateValues(isoString: string): void {
  const [yearStr, monthStr, dayStr] = isoString.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month in date: ${isoString}`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day in date: ${isoString}`);
  }
  if (year < 1900 || year > 2100) {
    throw new Error(`Year out of realistic range: ${isoString}`);
  }
}
