"use client"

import { useEffect, useId, useMemo, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react"
import { FaIcon } from "@/components/fa-icon"
import { messages } from "@/lib/i18n"
import {
  clearAddress,
  getAddressStorageSnapshot,
  isValidPostal,
  provinces,
  readSavedAddress,
  saveAddress,
  subscribeAddressStorage,
  type CheckoutAddress,
} from "@/lib/orders"
import {
  formatNationalMobile,
  formatPhoneForDisplay,
  isValidMobile,
  normalizePhone,
  toAsciiDigits,
} from "@/lib/phone"

type Field = keyof CheckoutAddress

const emptyForm: CheckoutAddress = {
  name: "",
  phone: "",
  province: "",
  city: "",
  postal: "",
  address: "",
}

const inputClass =
  "h-12 w-full rounded-xl bg-page px-4 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-mocha"

export function AddressesView({
  defaultName = "",
  defaultPhone = "",
}: {
  defaultName?: string
  defaultPhone?: string
}) {
  const dialogTitleId = useId()
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
  const raw = useSyncExternalStore(
    subscribeAddressStorage,
    getAddressStorageSnapshot,
    () => "",
  )
  const address = useMemo(
    () => (raw ? readSavedAddress() : null),
    [raw],
  )
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CheckoutAddress>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})

  function openForm(current?: CheckoutAddress | null) {
    setErrors({})
    setForm({
      name: current?.name || defaultName,
      phone: formatNationalMobile(current?.phone || defaultPhone),
      province: current?.province ?? "",
      city: current?.city ?? "",
      postal: current?.postal ?? "",
      address: current?.address ?? "",
    })
    setOpen(true)
  }

  useEffect(() => {
    if (!open) {
      return
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  function setField(field: Field, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
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

  function onSubmit(event: FormEvent) {
    event.preventDefault()

    if (!validate()) {
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

    saveAddress({ ...form, phone, name: form.name.trim() })
    setOpen(false)
  }

  return (
    <section className="overflow-hidden rounded-xl bg-surface shadow-card">
      <header className="border-b border-line px-5">
        <h1 className="-mb-px w-fit border-b-[3px] border-sale py-3.5 text-[15px] font-medium">
          {messages.account.addresses}
        </h1>
      </header>

      {!hydrated ? (
        <p className="px-5 py-16 text-center text-sm text-muted">
          {messages.shop.loading}
        </p>
      ) : address ? (
        <div className="p-5">
          <article className="rounded-xl border border-line p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{address.name}</p>
                <p className="mt-1 text-xs text-sale">
                  {messages.account.defaultAddress}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-soft hover:text-ink"
                  aria-label={messages.account.editAddress}
                  onClick={() => openForm(address)}
                >
                  <FaIcon icon="fa-pen" className="text-xs" />
                </button>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-soft hover:text-sale"
                  aria-label={messages.account.deleteAddress}
                  onClick={() => clearAddress()}
                >
                  <FaIcon icon="fa-trash-can" className="text-xs" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm" dir="ltr">
              {formatPhoneForDisplay(address.phone)}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              {address.province}، {address.city}
              <br />
              {address.address}
              <br />
              {messages.pay.postal} {address.postal}
            </p>
          </article>
        </div>
      ) : (
        <div className="flex flex-col items-center px-5 py-16 text-center">
          <AddressEmptyArt />
          <p className="mt-6 text-sm text-muted">
            {messages.account.addressesEmpty}
          </p>
          <AddAddressButton className="mt-6" onClick={() => openForm()} />
        </div>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/40 p-0 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            onSubmit={onSubmit}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-lg sm:rounded-2xl"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id={dialogTitleId} className="text-base font-medium">
                {address
                  ? messages.account.editAddress
                  : messages.account.addAddress}
              </h2>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-soft"
                aria-label={messages.account.cancel}
                onClick={() => setOpen(false)}
              >
                <FaIcon icon="fa-xmark" />
              </button>
            </div>
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
              <Field
                label={messages.pay.postal}
                error={errors.postal}
                className="sm:col-span-2"
              >
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
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="h-11 rounded-lg border border-line px-5 text-sm hover:border-mocha"
                onClick={() => setOpen(false)}
              >
                {messages.account.cancel}
              </button>
              <button
                type="submit"
                className="h-11 rounded-lg bg-sale px-5 text-sm text-white"
              >
                {messages.account.saveAddress}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}

function AddAddressButton({
  onClick,
  className = "",
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-2 rounded-lg border border-sale px-5 text-sm text-sale hover:bg-sale/5 ${className}`}
    >
      <FaIcon icon="fa-location-dot" />
      {messages.account.addAddress}
    </button>
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
  children: ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm text-muted">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-error">{error}</span>
      ) : null}
    </label>
  )
}

function AddressEmptyArt() {
  return (
    <svg
      viewBox="0 0 168 148"
      className="h-28 w-auto text-muted"
      aria-hidden="true"
    >
      <ellipse cx="84" cy="138" rx="36" ry="7" fill="currentColor" opacity="0.12" />
      <rect x="80" y="58" width="8" height="80" rx="2" fill="#c8c8c8" />
      <path
        d="M28 28h86a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H52l-20 12V36a8 8 0 0 1 8-8z"
        fill="#ececec"
        stroke="#d4d4d4"
        strokeWidth="2"
      />
      <path
        d="M46 38h62a6 6 0 0 1 6 6v10H58l-12 8V44a6 6 0 0 1 6-6z"
        fill="#ef4056"
      />
      <circle cx="84" cy="49" r="9" fill="#fff" />
      <rect x="82.2" y="43.5" width="3.6" height="7.5" rx="1.2" fill="#ef4056" />
      <circle cx="84" cy="54.2" r="1.6" fill="#ef4056" />
    </svg>
  )
}
