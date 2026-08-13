const IRAN_COUNTRY_CODE = "98"
const E164_MIN_DIGITS = 10
const E164_MAX_DIGITS = 15

export function toAsciiDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
}

export function normalizePhone(input: string): string | null {
  const trimmed = toAsciiDigits(input).trim()
  const digits = trimmed.replace(/\D/g, "")

  if (!digits) {
    return null
  }

  if (digits.startsWith(IRAN_COUNTRY_CODE) && digits.length === 12) {
    return `+${digits}`
  }

  if (digits.startsWith("0") && digits.length === 11 && digits[1] === "9") {
    return `+${IRAN_COUNTRY_CODE}${digits.slice(1)}`
  }

  if (digits.startsWith("9") && digits.length === 10) {
    return `+${IRAN_COUNTRY_CODE}${digits}`
  }

  if (
    trimmed.startsWith("+") &&
    digits.length >= E164_MIN_DIGITS &&
    digits.length <= E164_MAX_DIGITS
  ) {
    return `+${digits}`
  }

  return null
}

export function phoneToPlaceholderEmail(phone: string): string {
  return `${phone.replace(/\D/g, "")}@phone.raavistyle.local`
}
