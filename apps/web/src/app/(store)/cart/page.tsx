import Link from "next/link";
import { messages } from "@/lib/i18n";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-medium">{messages.shop.cart}</h1>
      <p className="mt-4 text-muted">{messages.shop.emptyCart}</p>
      <Link
        href="/products"
        className="mt-8 inline-flex h-12 items-center rounded-xl bg-mocha px-6 text-bone"
      >
        {messages.shop.continueShopping}
      </Link>
    </main>
  );
}
