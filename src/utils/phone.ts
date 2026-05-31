/**
 * Normalize an Indonesian phone number to the `+62…` form newton expects.
 * `08119950216` → `+628119950216`, `628…`/`+628…` pass through.
 */
export function toIndonesianPhone(raw: string): string {
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+62')) {
    return cleaned;
  }
  if (cleaned.startsWith('62')) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0')) {
    return `+62${cleaned.slice(1)}`;
  }
  return cleaned;
}
