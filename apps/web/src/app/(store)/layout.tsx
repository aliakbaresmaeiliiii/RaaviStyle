import { MobileDock } from "@/components/store/mobile-dock";
import { StoreFooter } from "@/components/store/store-footer";
import { StoreHeader } from "@/components/store/store-header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page pb-16 sm:pb-0">
      <StoreHeader />
      {children}
      <StoreFooter />
      <MobileDock />
    </div>
  );
}
