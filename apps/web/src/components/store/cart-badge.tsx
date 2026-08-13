"use client";

import { useCart } from "@/components/store/cart-provider";

export function CartBadge() {
  const { count } = useCart();

  if (count < 1) {
    return null;
  }

  return (
    <span className="absolute -top-1 -left-1 flex min-w-5 items-center justify-center rounded-full bg-sale px-1 text-[10px] leading-5 text-white">
      {count.toLocaleString("fa-IR")}
    </span>
  );
}
