import Link from "next/link";
import { Suspense } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { FaIcon } from "@/components/fa-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartMenu } from "@/components/store/cart-menu";
import { StoreSearch } from "@/components/store/store-search";
import { getCustomer } from "@/lib/auth";
import { categories } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

export async function StoreHeader() {
  const customer = await getCustomer();

  return (
    <header className="sticky top-0 z-40 bg-surface shadow-sm">
      <div className="bg-espresso text-center text-[11px] text-bone sm:text-xs">
        <p className="mx-auto max-w-7xl px-4 py-1.5 sm:py-2">
          {messages.shop.topBar}
        </p>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:gap-4 sm:py-3">
        <BrandLogo className="h-10 sm:h-14" priority />
        <Suspense
          fallback={
            <div className="h-11 min-w-0 flex-1 rounded-xl bg-page ring-1 ring-line" />
          }
        >
          <StoreSearch />
        </Suspense>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={customer ? "/account" : "/login"}
            className="hidden h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm hover:border-mocha hover:text-mocha sm:inline-flex"
          >
            <FaIcon icon="fa-user" />
            {customer ? messages.nav.account : messages.nav.signIn}
          </Link>
          <CartMenu />
        </div>
      </div>
      <nav
        className="hidden border-t border-line/70 lg:block"
        aria-label={messages.shop.categories}
      >
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
                className="inline-flex px-3 py-3 text-muted hover:text-ink"
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
