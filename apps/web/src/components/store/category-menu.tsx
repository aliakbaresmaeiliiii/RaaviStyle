"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import { FaIcon } from "@/components/fa-icon"
import { useCatalogFilters } from "@/components/store/catalog-provider"
import { messages } from "@/lib/i18n"

export function CategoryMenu() {
  const filters = useCatalogFilters()
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

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className={`inline-flex items-center gap-2 py-3 text-sm ${
          open ? "text-mocha" : "text-ink hover:text-mocha"
        }`}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <FaIcon icon="fa-bars" />
        <span className="font-medium">{messages.nav.categories}</span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute start-0 top-full z-50 w-64 rounded-xl bg-surface py-2 shadow-lg ring-1 ring-line"
        >
          <Link
            href="/products"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-mocha hover:bg-soft"
          >
            <FaIcon icon="fa-table-cells" />
            {messages.shop.allCategories}
          </Link>
          {filters.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-soft"
            >
              <FaIcon icon={category.icon} className="w-4 text-muted" />
              {category.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
