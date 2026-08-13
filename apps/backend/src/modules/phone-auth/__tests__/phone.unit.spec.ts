import { normalizePhone, phoneToPlaceholderEmail } from "../phone"

describe("normalizePhone", () => {
  it("normalizes local Iranian numbers starting with 0", () => {
    expect(normalizePhone("09121234567")).toEqual("+989121234567")
  })

  it("normalizes Iranian numbers without a leading zero", () => {
    expect(normalizePhone("9121234567")).toEqual("+989121234567")
  })

  it("normalizes numbers that already include the country code", () => {
    expect(normalizePhone("989121234567")).toEqual("+989121234567")
    expect(normalizePhone("+98 912 123 4567")).toEqual("+989121234567")
  })

  it("keeps other E.164 numbers", () => {
    expect(normalizePhone("+14155552671")).toEqual("+14155552671")
  })

  it("normalizes Persian digits", () => {
    expect(normalizePhone("۰۹۱۲۱۲۳۴۵۶۷")).toEqual("+989121234567")
  })

  it("returns null for invalid input", () => {
    expect(normalizePhone("")).toBeNull()
    expect(normalizePhone("123")).toBeNull()
    expect(normalizePhone("phone")).toBeNull()
  })
})

describe("phoneToPlaceholderEmail", () => {
  it("builds a unique local email from the E.164 number", () => {
    expect(phoneToPlaceholderEmail("+989121234567")).toEqual(
      "989121234567@phone.raavistyle.local"
    )
  })
})
