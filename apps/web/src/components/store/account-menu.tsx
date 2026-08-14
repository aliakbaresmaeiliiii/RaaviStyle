"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import { FaIcon } from "@/components/fa-icon"
import { logout } from "@/lib/auth"
import { messages } from "@/lib/i18n"

type AccountMenuProps = {
  signedIn: boolean
  name?: string
}

const menuLinks = [
  { href: "/orders", icon: "fa-bag-shopping", label: messages.account.ordersShort },
  { href: "/account/addresses", icon: "fa-signs-post", label: messages.account.addresses },
  { href: "/account/lists", icon: "fa-heart", label: messages.account.lists },
  { href: "/account/comments", icon: "fa-comment", label: messages.account.comments },
]

export function AccountMenu({ signedIn, name }: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) {
      return
    }

    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  function close() {
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-ink hover:text-mocha"
        aria-label={signedIn ? messages.nav.account : messages.nav.signIn}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-blush/50 text-espresso">
          <FaIcon icon="fa-user" />
        </span>
        <FaIcon
          icon="fa-chevron-down"
          className={`text-[10px] text-muted ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full end-0 z-50 mt-2 w-[19rem] overflow-hidden rounded-xl bg-surface shadow-lg ring-1 ring-line"
        >
          {signedIn ? (
            <SignedInPanel name={name} onNavigate={close} />
          ) : (
            <GuestPanel onNavigate={close} />
          )}
        </div>
      ) : null}
    </div>
  )
}

function GuestPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className="px-4 py-4">
        <p className="text-sm font-medium">{messages.nav.signIn}</p>
        <p className="mt-1 text-xs leading-6 text-muted">
          {messages.account.loginHint}
        </p>
        <Link
          href="/login"
          role="menuitem"
          onClick={onNavigate}
          className="mt-3 flex h-11 items-center justify-center rounded-lg bg-espresso text-sm text-white hover:bg-mocha"
        >
          {messages.account.loginCta}
        </Link>
      </div>
      <div className="border-t border-line">
        {menuLinks.map((item, index) => (
          <MenuRow
            key={item.href}
            {...item}
            onNavigate={onNavigate}
            lined={index < menuLinks.length - 1}
          />
        ))}
      </div>
    </>
  )
}

function SignedInPanel({
  name,
  onNavigate,
}: {
  name?: string
  onNavigate: () => void
}) {
  return (
    <>
      <Link
        href="/account"
        role="menuitem"
        onClick={onNavigate}
        className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-soft"
      >
        <span className="truncate text-sm font-medium">
          {name || messages.nav.account}
        </span>
        <FaIcon icon="fa-chevron-left" className="text-[11px] text-muted" />
      </Link>
      <div className="mx-4 border-t border-line" />
      <Link
        href="/products"
        role="menuitem"
        onClick={onNavigate}
        className="flex items-stretch hover:bg-soft"
      >
        <span className="flex w-11 shrink-0 items-center justify-center text-muted">
          <FaIcon icon="fa-sparkles" />
        </span>
        <span className="flex flex-1 items-center justify-between gap-3 py-3 pe-4">
          <span className="text-sm">{messages.account.plus}</span>
          <span className="inline-flex items-center gap-1 text-xs text-[#9d4edd]">
            {messages.account.plusCta}
            <FaIcon icon="fa-chevron-left" className="text-[10px]" />
          </span>
        </span>
      </Link>
      <div className="mx-4 border-t border-line" />
      {menuLinks.map((item) => (
        <MenuRow key={item.href} {...item} onNavigate={onNavigate} lined />
      ))}
      <form action={logout}>
        <button
          type="submit"
          role="menuitem"
          className="flex w-full items-stretch hover:bg-soft"
        >
          <span className="flex w-11 shrink-0 items-center justify-center text-muted">
            <FaIcon icon="fa-right-from-bracket" />
          </span>
          <span className="flex flex-1 items-center py-3 pe-4 text-sm">
            {messages.account.signOutFull}
          </span>
        </button>
      </form>
    </>
  )
}

function MenuRow({
  href,
  icon,
  label,
  onNavigate,
  lined = false,
}: {
  href: string
  icon: string
  label: string
  onNavigate: () => void
  lined?: boolean
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="flex items-stretch hover:bg-soft"
    >
      <span className="flex w-11 shrink-0 items-center justify-center text-muted">
        <FaIcon icon={icon} />
      </span>
      <span
        className={`flex flex-1 items-center py-3 pe-4 text-sm ${
          lined ? "border-b border-line" : ""
        }`}
      >
        {label}
      </span>
    </Link>
  )
}
