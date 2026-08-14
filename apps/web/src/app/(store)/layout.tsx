import { AnalyticsBeacon } from "@/components/store/analytics-beacon";
import { CartProvider } from "@/components/store/cart-provider";
import { CatalogProvider } from "@/components/store/catalog-provider";
import { MobileDock } from "@/components/store/mobile-dock";
import { StoreFooter } from "@/components/store/store-footer";
import { StoreHeader } from "@/components/store/store-header";
import { SkipLink } from "@/components/skip-link";
import { loadStoreProducts } from "@/lib/medusa-catalog";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const catalog = await loadStoreProducts();

  return (
    <CatalogProvider products={catalog}>
      <CartProvider>
        <div className="min-h-screen bg-page pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-0">
          <AnalyticsBeacon />
          <SkipLink />
          <StoreHeader />
          <div id="main-content">{children}</div>
          <StoreFooter />
          <MobileDock />
        </div>
      </CartProvider>
    </CatalogProvider>
  );
}
