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
      <div className="bg-[#ED1944] text-center text-[11px] text-bone sm:text-xs">
        <p className="flex  items-center justify-center gap-1.5  px-4 py-1.5 sm:py-2">
          <span className="text-2xl font-extrabold">{messages.shop.topBar}</span>
          <span
            className="
   relative inline-block overflow-hidden h-10
    rounded-3xl bg-white p-2 text-xl text-red-500 font-extrabold
    after:absolute after:inset-y-0 after:-left-full
    after:w-1/2 after:skew-x-[-20deg]
    after:bg-gradient-to-r
    after:from-transparent after:via-white/80 after:to-transparent
    after:animate-[shine_2.5s_ease-in-out_infinite]
            "
          >
            4 قسط با دیجی پی
          </span>
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
