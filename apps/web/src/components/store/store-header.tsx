import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { FaIcon } from "@/components/fa-icon";
import { getCustomer } from "@/lib/auth";
import { categories } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

export async function StoreHeader() {
  const customer = await getCustomer();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-espresso text-center text-xs text-bone">
        <p className="mx-auto max-w-7xl px-4 py-2">{messages.shop.topBar}</p>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <BrandLogo className="h-12 shrink-0" priority />
        <form action="/products" className="relative min-w-0 flex-1">
          <FaIcon
            icon="fa-magnifying-glass"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
          />
          <input
            name="q"
            type="search"
            placeholder={messages.shop.search}
            className="h-12 w-full rounded-xl bg-page pr-10 pl-4 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-mocha"
          />
        </form>
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href={customer ? "/account" : "/login"}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm hover:border-mocha hover:text-mocha"
          >
            <FaIcon icon="fa-user" />
            {customer ? messages.nav.account : messages.nav.signIn}
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line hover:border-mocha hover:text-mocha"
            aria-label={messages.shop.cart}
          >
            <FaIcon icon="fa-cart-shopping" />
            <span className="absolute -top-1 -left-1 flex size-5 items-center justify-center rounded-full bg-sale text-[10px] text-white">
              ۰
            </span>
          </Link>
        </div>
      </div>
      <nav className="hidden border-t border-line/70 lg:block">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 text-sm">
          <li>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-3 py-3 text-mocha"
            >
              <FaIcon icon="fa-bars" />
              {messages.shop.allCategories}
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.href}>
              <Link
                href={category.href}
                className="inline-flex px-3 py-3 text-muted hover:text-espresso"
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
