import {
  normalizeProductHandlesInBody,
  slugifyInvalidHandle,
} from "../normalize-product-handles"

describe("slugifyInvalidHandle", () => {
  it("turns Persian titles with spaces into a valid handle", () => {
    const product = { handle: "شلوار زمستانی" }
    slugifyInvalidHandle(product)
    expect(product.handle).toEqual("شلوار-زمستانی")
  })

  it("leaves already valid latin handles unchanged", () => {
    const product = { handle: "winter-pants" }
    slugifyInvalidHandle(product)
    expect(product.handle).toEqual("winter-pants")
  })

  it("does not invent a handle when none was sent", () => {
    const product: { handle?: string } = {}
    slugifyInvalidHandle(product)
    expect(product.handle).toBeUndefined()
  })
})

describe("normalizeProductHandlesInBody", () => {
  it("slugifies a create-product body", () => {
    const body = { title: "شلوار زمستانی", handle: "شلوار زمستانی" }
    normalizeProductHandlesInBody(body)
    expect(body.handle).toEqual("شلوار-زمستانی")
  })

  it("slugifies batch create payloads", () => {
    const body = {
      create: [{ handle: "کت پشمی" }],
    }
    normalizeProductHandlesInBody(body)
    expect(body.create[0].handle).toEqual("کت-پشمی")
  })
})
