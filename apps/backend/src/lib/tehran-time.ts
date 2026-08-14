const TEHRAN_OFFSET_MS = 3.5 * 60 * 60 * 1000

function shiftToTehran(date: Date) {
  return new Date(date.getTime() + TEHRAN_OFFSET_MS)
}

export function tehranDayKey(date: Date) {
  return shiftToTehran(date).toISOString().slice(0, 10)
}

export function startOfTehranDay(date = new Date()) {
  const key = tehranDayKey(date)
  return new Date(`${key}T00:00:00.000+03:30`)
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setTime(next.getTime() + days * 24 * 60 * 60 * 1000)
  return next
}

export function rangeStart(days: number) {
  return startOfTehranDay(addDays(new Date(), -days + 1))
}

export const WEEKDAY_FA = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
]

export function weekdayFa(date: Date) {
  return WEEKDAY_FA[shiftToTehran(date).getUTCDay()]
}

export function faDateLabel(isoDay: string) {
  const date = new Date(`${isoDay}T12:00:00.000+03:30`)
  return new Intl.DateTimeFormat("fa-IR", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Tehran",
  }).format(date)
}
