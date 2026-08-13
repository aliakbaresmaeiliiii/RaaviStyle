import { CartProvider } from "@/components/store/cart-provider";
import { MobileDock } from "@/components/store/mobile-dock";
import { StoreFooter } from "@/components/store/store-footer";
import { StoreHeader } from "@/components/store/store-header";
import { SkipLink } from "@/components/skip-link";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-page pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-0">
        <SkipLink />
        <StoreHeader />
        <div id="main-content">{children}</div>
        <StoreFooter />
        <MobileDock />
      </div>
    </CartProvider>
  );
}
