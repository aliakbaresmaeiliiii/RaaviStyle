"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, useSyncExternalStore } from "react"
import { FaIcon } from "@/components/fa-icon"
import { useCart } from "@/components/store/cart-provider"
import { useCatalog } from "@/components/store/catalog-provider"
import { formatToman } from "@/lib/catalog"
import { checkoutTotals, resolveCart } from "@/lib/cart"
import { messages } from "@/lib/i18n"
import {
  ADDRESS_STORAGE_KEY,
  createOrderId,
  isValidPostal,
  provinces,
  saveAddress,
  saveOrder,
  snapshotItems,
  type CheckoutAddress,
  type OrderLifecycle,
  type PaymentMethodId,
} from "@/lib/orders"
import {
  formatNationalMobile,
  isValidMobile,
  normalizePhone,
  toAsciiDigits,
} from "@/lib/phone"

const methods: Array<{
  id: PaymentMethodId
  icon: string
  title: string
  body: string
  tone?: string
}> = [
  {
    id: "cod",
    icon: "fa-money-bill-wave",
    title: messages.pay.methodCod,
    body: messages.pay.methodCodBody,
  },
  {
    id: "online",
    icon: "fa-credit-card",
    title: messages.pay.methodOnline,
    body: messages.pay.methodOnlineBody,
  },
  {
    id: "snapp",
    icon: "fa-bolt",
    title: messages.pay.methodSnapp,
    body: messages.pay.methodSnappBody,
    tone: "bg-[#2f6fed] text-white",
  },
  {
    id: "tara",
    icon: "fa-wallet",
    title: messages.pay.methodTara,
    body: messages.pay.methodTaraBody,
    tone: "bg-[#6d28d9] text-white",
  },
]

function subscribeAddress(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === ADDRESS_STORAGE_KEY || event.key === null) {
      onChange()
    }
  }

  window.addEventListener("storage", onStorage)
  return () => window.removeEventListener("storage", onStorage)
}

function getAddressSnapshot() {
  try {
    return window.localStorage.getItem(ADDRESS_STORAGE_KEY) ?? ""
  } catch {
    return ""
  }
}

type Field = keyof CheckoutAddress

export function CheckoutView({
  defaultPhone = "",
  defaultName = "",
}: {
  defaultPhone?: string
  defaultName?: string
}) {
  const router = useRouter()
  const products = useCatalog()
  const { lines, ready, clearCart } = useCart()
  const items = useMemo(() => resolveCart(lines, products), [lines, products])
  const totals = useMemo(() => checkoutTotals(items), [items])
  const savedRaw = useSyncExternalStore(
    subscribeAddress,
    getAddressSnapshot,
    () => "",
  )
  const saved = useMemo(() => {
    if (!savedRaw) {
      return null
    }

    try {
      return JSON.parse(savedRaw) as CheckoutAddress
    } catch {
      return null
    }
  }, [savedRaw])
  const [payment, setPayment] = useState<PaymentMethodId>("cod")
  const [overrides, setOverrides] = useState<Partial<CheckoutAddress>>({})
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [placing, setPlacing] = useState(false)
  const form: CheckoutAddress = {
    name: overrides.name ?? saved?.name ?? defaultName,
    phone:
      overrides.phone ?? saved?.phone ?? formatNationalMobile(defaultPhone),
    province: overrides.province ?? saved?.province ?? "",
    city: overrides.city ?? saved?.city ?? "",
    postal: overrides.postal ?? saved?.postal ?? "",
    address: overrides.address ?? saved?.address ?? "",
  }

  function setField(field: Field, value: string) {
    setOverrides((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validate() {
    const next: Partial<Record<Field, string>> = {}

    if (form.name.trim().length < 3) {
      next.name = messages.pay.required
    }
    if (!isValidMobile(form.phone)) {
      next.phone = messages.errors.invalidPhone
    }
    if (!form.province) {
      next.province = messages.pay.required
    }
    if (form.city.trim().length < 2) {
      next.city = messages.pay.required
    }
    if (!isValidPostal(form.postal)) {
      next.postal = messages.pay.invalidPostal
    }
    if (form.address.trim().length < 8) {
      next.address = messages.pay.required
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault()

    if (!items.length || placing || !validate()) {
      return
    }

    const phone = normalizePhone(form.phone)

    if (!phone) {
      setErrors((current) => ({
        ...current,
        phone: messages.errors.invalidPhone,
      }))
      return
    }

    setPlacing(true)

    const address = { ...form, phone, name: form.name.trim() }
    const order = {
      id: createOrderId(),
      createdAt: Date.now(),
      payment,
      lifecycle: (payment === "cod" ? "ship" : "pay") as OrderLifecycle,
      paidAt: payment === "cod" ? Date.now() : undefined,
      address,
      items: snapshotItems(items),
      totals: {
        itemsPrice: totals.itemsPrice,
        discount: totals.discount,
        shipping: totals.shipping,
        payable: totals.payable,
      },
    }

    saveAddress(address)
    saveOrder(order)
    clearCart()
    router.push(`/checkout/success?order=${order.id}`)
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-medium">{messages.pay.title}</h1>
        <p className="mt-6 text-sm text-muted">{messages.shop.loading}</p>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-medium">{messages.pay.title}</h1>
        <p className="mt-4 text-muted">{messages.pay.empty}</p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-espresso px-6 text-sm text-white"
        >
          {messages.shop.continueShopping}
        </Link>
      </main>
    )
  }

  const inputClass =
    "h-12 w-full rounded-xl bg-page px-4 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-mocha"

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-5 text-xs text-cocoa">
        <Link href="/" className="hover:text-ink">
          {messages.shop.breadcrumbHome}
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <Link href="/cart" className="hover:text-ink">
          {messages.shop.cart}
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-ink">{messages.pay.title}</span>
      </nav>

      <h1 className="text-2xl font-medium">{messages.pay.title}</h1>

      <form
        onSubmit={placeOrder}
        className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="space-y-4">
          <section className="rounded-2xl bg-surface p-5 shadow-card">
            <h2 className="mb-5 text-base font-medium">
              {messages.pay.shipping}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={messages.pay.name}
                error={errors.name}
                className="sm:col-span-2"
              >
                <input
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  autoComplete="name"
                  className={inputClass}
                />
              </Field>
              <Field label={messages.pay.phone} error={errors.phone}>
                <input
                  dir="ltr"
                  value={form.phone}
                  onChange={(event) =>
                    setField("phone", formatNationalMobile(event.target.value))
                  }
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="۹۱۲ ۱۲۳ ۴۵۶۷"
                  className={`${inputClass} text-left`}
                />
              </Field>
              <Field label={messages.pay.province} error={errors.province}>
                <select
                  value={form.province}
                  onChange={(event) => setField("province", event.target.value)}
                  className={inputClass}
                >
                  <option value="">{messages.pay.provincePlaceholder}</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={messages.pay.city} error={errors.city}>
                <input
                  value={form.city}
                  onChange={(event) => setField("city", event.target.value)}
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </Field>
              <Field label={messages.pay.postal} error={errors.postal}>
                <input
                  dir="ltr"
                  value={form.postal}
                  onChange={(event) =>
                    setField(
                      "postal",
                      toAsciiDigits(event.target.value)
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    )
                  }
                  inputMode="numeric"
                  autoComplete="postal-code"
                  className={`${inputClass} text-left`}
                />
              </Field>
              <Field
                label={messages.pay.address}
                error={errors.address}
                className="sm:col-span-2"
              >
                <textarea
                  value={form.address}
                  onChange={(event) => setField("address", event.target.value)}
                  rows={3}
                  placeholder={messages.pay.addressPlaceholder}
                  className="w-full rounded-xl bg-page px-4 py-3 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-mocha"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl bg-surface p-5 shadow-card">
            <h2 className="mb-5 text-base font-medium">{messages.pay.payment}</h2>
            <div className="grid gap-3">
              {methods.map((method) => {
                const selected = payment === method.id

                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl p-4 ring-1 transition ${
                      selected
                        ? "bg-soft ring-espresso"
                        : "bg-page ring-line hover:ring-mocha"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selected}
                      onChange={() => setPayment(method.id)}
                      className="mt-1 accent-espresso"
                    />
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        method.tone ?? "bg-soft text-mocha"
                      }`}
                    >
                      <FaIcon icon={method.icon} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">
                        {method.title}
                      </span>
                      <span className="mt-1 block text-xs leading-6 text-muted">
                        {method.body}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
            {payment !== "cod" ? (
              <p className="mt-4 text-xs leading-6 text-muted">
                {messages.pay.gatewayNote}
              </p>
            ) : null}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl bg-surface p-5 shadow-card">
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-soft">
                    <Image
                      src={item.product.image[0]}
                      alt={item.product.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm">{item.product.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {messages.shop.cartUnitPrice(
                        item.quantity,
                        item.product.price,
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">{messages.shop.itemsPrice}</dt>
                <dd>{formatToman(totals.itemsPrice)}</dd>
              </div>
              {totals.discount > 0 ? (
                <div className="flex justify-between text-sale">
                  <dt>{messages.shop.itemsDiscount}</dt>
                  <dd>{formatToman(totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-muted">{messages.shop.shippingCost}</dt>
                <dd>
                  {totals.freeShipping
                    ? messages.shop.shippingFreeLabel
                    : formatToman(totals.shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
                <dt>{messages.shop.payable}</dt>
                <dd>{formatToman(totals.payable)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={placing}
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-espresso text-sm text-white disabled:opacity-60"
            >
              {placing ? messages.pay.placing : messages.pay.placeOrder}
            </button>
          </div>
        </aside>
      </form>
    </main>
  )
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className}`.trim()}>
      <span className="mb-2 block text-sm text-muted">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-error">{error}</span>
      ) : null}
    </label>
  )
}
