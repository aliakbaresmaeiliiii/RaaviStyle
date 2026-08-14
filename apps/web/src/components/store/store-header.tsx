import { Suspense } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { AccountMenu } from "@/components/store/account-menu";
import { CartMenu } from "@/components/store/cart-menu";
import { StoreNavBar } from "@/components/store/store-nav-bar";
import { StoreSearch } from "@/components/store/store-search";
import { getCustomer } from "@/lib/auth";
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
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:gap-6 sm:py-3">
        <BrandLogo className="h-10 sm:h-12" priority />
        <Suspense
          fallback={
            <div className="h-12 min-w-0 flex-1 rounded-full bg-soft" />
          }
        >
          <StoreSearch />
        </Suspense>
        <div className="flex items-center">
          <AccountMenu
            signedIn={Boolean(customer)}
            name={[customer?.first_name, customer?.last_name]
              .filter(Boolean)
              .join(" ")}
          />
          <span className="mx-2 h-6 w-px bg-line" aria-hidden="true" />
          <CartMenu />
        </div>
      </div>
      <StoreNavBar />
    </header>
  );
}
