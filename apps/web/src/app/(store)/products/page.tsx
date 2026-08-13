import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogHome } from "@/components/store/catalog-home";
import { messages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: `${messages.shop.allCategories} | ${messages.meta.title}`,
};

function CatalogFallback() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8">
      <p className="text-sm text-muted">{messages.shop.loading}</p>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogHome />
    </Suspense>
  );
}
