import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

export function normalizePhone(raw: string): { e164: string; ok: boolean } {
  const cleaned = raw.replace(/[^\d+]/g, '');
  try {
    const num = parsePhoneNumberFromString(cleaned, 'US');
    if (num && num.isValid()) return { e164: num.number, ok: true };
  } catch {}
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 10) return { e164: `+1${digits}`, ok: true };
  return { e164: cleaned, ok: false };
}