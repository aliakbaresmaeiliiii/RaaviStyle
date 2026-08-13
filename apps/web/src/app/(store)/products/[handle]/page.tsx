import Link from "next/link";
import { notFound } from "next/navigation";
import { formatToman, products } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = products.find((item) => item.href.endsWith(handle));

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-2">
      <div
        className="min-h-80 rounded-2xl"
        style={{ background: product.tone }}
      />
      <div>
        {product.badge ? (
          <p className="text-sm text-sale">{product.badge} تخفیف</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-medium">{product.title}</h1>
        {product.sold ? (
          <p className="mt-3 text-sm text-sale">{product.sold}</p>
        ) : null}
        <div className="mt-6">
          {product.compareAt ? (
            <p className="text-sm text-muted line-through">
              {formatToman(product.compareAt)}
            </p>
          ) : null}
          <p className="text-2xl font-medium">{formatToman(product.price)}</p>
        </div>
        <button
          type="button"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-mocha px-6 text-bone"
        >
          {messages.shop.addToCart}
        </button>
        <p className="mt-4">
          <Link href="/products" className="text-sm text-mocha">
            {messages.shop.continueShopping}
          </Link>
        </p>
      </div>
    </main>
  );
}
