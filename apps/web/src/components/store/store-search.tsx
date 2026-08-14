"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaIcon } from "@/components/fa-icon";
import { messages } from "@/lib/i18n";

export function StoreSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);

  function clearSearch() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (query) {
      router.push("/products");
    }
  }

  return (
    <form action="/products" className="relative min-w-0 flex-1">
      <label className="sr-only" htmlFor="store-search">
        {messages.shop.searchAria}
      </label>
      <FaIcon
        icon="fa-magnifying-glass"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
      />
      <input
        key={query}
        id="store-search"
        ref={inputRef}
        name="q"
        type="search"
        defaultValue={query}
        placeholder={messages.shop.search}
        autoComplete="off"
        enterKeyHint="search"
        className="peer h-11 w-full rounded-full bg-soft pr-10 pl-10 text-sm outline-none focus:ring-2 focus:ring-mocha sm:h-12 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="button"
        onClick={clearSearch}
        className="absolute top-1/2 left-2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-ink peer-not-placeholder-shown:flex"
        aria-label={messages.shop.searchClear}
      >
        <FaIcon icon="fa-xmark" />
      </button>
    </form>
  );
}
