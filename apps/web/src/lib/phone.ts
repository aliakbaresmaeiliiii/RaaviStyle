const IRAN_COUNTRY_CODE = "98";
const E164_MIN_DIGITS = 10;
const E164_MAX_DIGITS = 15;

export function toAsciiDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function normalizePhone(input: string): string | null {
  const trimmed = toAsciiDigits(input).trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith(IRAN_COUNTRY_CODE) && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 11 && digits[1] === "9") {
    return `+${IRAN_COUNTRY_CODE}${digits.slice(1)}`;
  }

  if (digits.startsWith("9") && digits.length === 10) {
    return `+${IRAN_COUNTRY_CODE}${digits}`;
  }

  if (
    trimmed.startsWith("+") &&
    digits.length >= E164_MIN_DIGITS &&
    digits.length <= E164_MAX_DIGITS
  ) {
    return `+${digits}`;
  }

  return null;
}

export function phoneToPlaceholderEmail(phone: string): string {
  return `${phone.replace(/\D/g, "")}@phone.raavistyle.local`;
}

export function toPersianDigits(value: string): string {
  return value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)] ?? digit);
}

export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizePhone(phone) ?? phone;
  if (normalized.startsWith("+98") && normalized.length === 13) {
    const local = `0${normalized.slice(3)}`;
    return toPersianDigits(
      `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
    );
  }
  return toPersianDigits(normalized);
}

export function formatPhoneInput(value: string): string {
  let digits = toAsciiDigits(value).replace(/\D/g, "");

  if (digits.startsWith("98")) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.startsWith("9") && !digits.startsWith("09")) {
    digits = `0${digits}`;
  }

  digits = digits.slice(0, 11);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

export function formatNationalMobile(value: string): string {
  let digits = toAsciiDigits(value).replace(/\D/g, "");

  if (digits.startsWith("98")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function isValidMobile(value: string): boolean {
  return Boolean(normalizePhone(value));
}
