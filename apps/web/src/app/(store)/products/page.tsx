import { ProductCard } from "@/components/store/product-card";
import { products } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-medium">{messages.shop.allCategories}</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
