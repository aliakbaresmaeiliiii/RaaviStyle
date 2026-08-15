"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/store/product-card";
import { FaIcon } from "@/components/fa-icon";
import { useCatalog } from "@/components/store/catalog-provider";
import {
  PRICE_MAX,
  categories,
  colorFilters,
  colorLabel,
  sizeFilters,
  type Product,
} from "@/lib/catalog";
import { messages } from "@/lib/i18n";

type SortKey = "sales" | "popular" | "newest" | "cheap" | "expensive";

const sorts: Array<{ id: SortKey; label: string }> = [
  { id: "sales", label: "پرفروش‌ترین" },
  { id: "popular", label: "محبوبیت" },
  { id: "newest", label: "جدیدترین" },
  { id: "cheap", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
];

export function CatalogHome() {
  const products = useCatalog();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = (params.get("q") ?? "").trim();
  const categoryParam = params.get("cat") ?? "";
  const saleFromUrl = categoryParam === "sale";
  const selectedCategory = saleFromUrl ? "" : categoryParam;

  const [sort, setSort] = useState<SortKey>("sales");
  const [open, setOpen] = useState({
    category: true,
    color: false,
    size: false,
    price: true,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);

  function setSelectedCategory(id: string) {
    const next = new URLSearchParams(params.toString());
    if (id) {
      next.set("cat", id);
    } else {
      next.delete("cat");
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function resetFilters() {
    setSelectedColor("");
    setSelectedSize("");
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setOnlyStock(false);
    setOnlySale(false);
    setSelectedCategory("");
  }

  const filtered = useMemo(() => {
    const next = products.filter((product) => {
      if (query && !product.title.includes(query)) {
        return false;
      }
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      if (selectedColor && !product.colors.includes(selectedColor)) {
        return false;
      }
      if (selectedSize && !product.sizes.includes(selectedSize)) {
        return false;
      }
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }
      if (onlyStock && !product.inStock) {
        return false;
      }
      if ((onlySale || saleFromUrl) && !product.compareAt) {
        return false;
      }
      return true;
    });

    return next.sort((a, b) => sortProducts(a, b, sort));
  }, [
    query,
    sort,
    selectedCategory,
    selectedColor,
    selectedSize,
    minPrice,
    maxPrice,
    onlyStock,
    onlySale,
    saleFromUrl,
    products,
  ]);

  const chips = [
    selectedCategory
      ? {
          id: "cat",
          label: categories.find((item) => item.id === selectedCategory)?.label,
          onClear: () => setSelectedCategory(""),
        }
      : null,
    selectedColor
      ? {
          id: "color",
          label: colorLabel(selectedColor),
          onClear: () => setSelectedColor(""),
        }
      : null,
    selectedSize
      ? {
          id: "size",
          label: `${messages.shop.chooseSize} ${selectedSize}`,
          onClear: () => setSelectedSize(""),
        }
      : null,
    onlyStock
      ? { id: "stock", label: messages.shop.onlyStock, onClear: () => setOnlyStock(false) }
      : null,
    onlySale || saleFromUrl
      ? {
          id: "sale",
          label: messages.shop.onlySale,
          onClear: () => {
            setOnlySale(false);
            if (saleFromUrl) {
              setSelectedCategory("");
            }
          },
        }
      : null,
    minPrice > 0 || maxPrice < PRICE_MAX
      ? {
          id: "price",
          label: `${minPrice.toLocaleString("fa-IR")} – ${maxPrice.toLocaleString("fa-IR")}`,
          onClear: () => {
            setMinPrice(0);
            setMaxPrice(PRICE_MAX);
          },
        }
      : null,
  ].filter((chip) => chip !== null);

  const filterCount = chips.length;

  useEffect(() => {
    if (!filtersOpen) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFiltersOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  const filterProps = {
    open,
    setOpen,
    selectedCategory,
    setSelectedCategory,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    onlyStock,
    setOnlyStock,
    onlySale: onlySale || saleFromUrl,
    setOnlySale: (value: boolean) => {
      setOnlySale(value);
      if (!value && saleFromUrl) {
        setSelectedCategory("");
      }
    },
    resetFilters,
  };

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-5">
      {query ? (
        <h1 className="mb-4 text-lg font-medium">
          {messages.shop.searchResults(query)}
        </h1>
      ) : (
        <h1 className="mb-4 text-lg font-medium">
          {saleFromUrl
            ? messages.shop.amazing
            : selectedCategory
              ? categories.find((item) => item.id === selectedCategory)?.label
              : messages.shop.allCategories}
        </h1>
      )}

      <div className="mb-4 flex items-center gap-2 rounded-xl bg-surface px-3 py-2 shadow-card sm:px-4 sm:py-3">
        <div className="hidden min-w-0 flex-1 flex-wrap items-center gap-2 lg:flex">
          <p className="ml-2 flex items-center gap-2 text-sm text-muted">
            <FaIcon icon="fa-sort" />
            {messages.shop.sort}
          </p>
          {sorts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSort(item.id)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                sort === item.id
                  ? "bg-espresso text-white"
                  : "bg-page text-ink hover:bg-soft"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
          <span className="sr-only">{messages.shop.sort}</span>
          <FaIcon icon="fa-sort" className="text-muted" />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="h-10 w-full rounded-lg bg-page px-2 text-sm outline-none"
          >
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="relative inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-page px-3 text-sm lg:hidden"
          onClick={() => setFiltersOpen(true)}
        >
          <FaIcon icon="fa-filter" />
          {messages.shop.openFilters}
          {filterCount > 0 ? (
            <span className="flex min-w-5 items-center justify-center rounded-full bg-espresso px-1 text-[10px] leading-5 text-white">
              {filterCount.toLocaleString("fa-IR")}
            </span>
          ) : null}
        </button>
      </div>

      {chips.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={chip.onClear}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs ring-1 ring-line"
            >
              {chip.label}
              <FaIcon icon="fa-xmark" className="text-[10px]" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden space-y-3 lg:block">
          <FilterPanel {...filterProps} />
        </aside>

        <section>
          <p className="mb-3 text-sm text-muted" aria-live="polite">
            {messages.shop.resultsCount(filtered.length)}
          </p>
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-surface px-6 py-16 text-center">
              <p className="text-lg font-medium">{messages.shop.noResults}</p>
              <p className="mt-2 text-sm text-muted">{messages.shop.noResultsHint}</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex h-11 items-center rounded-xl bg-espresso px-5 text-sm text-white"
              >
                {messages.shop.clearFilter}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={messages.shop.openFilters}>
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={messages.shop.closeFilters}
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-page pb-[env(safe-area-inset-bottom)] shadow-xl">
            <div className="flex items-center justify-between px-4 py-4">
              <p className="font-medium">{messages.shop.openFilters}</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex size-10 items-center justify-center rounded-xl bg-surface"
                aria-label={messages.shop.closeFilters}
              >
                <FaIcon icon="fa-xmark" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4">
              <FilterPanel {...filterProps} />
            </div>
            <div className="border-t border-line bg-page p-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-espresso text-sm text-white"
              >
                {messages.shop.resultsCount(filtered.length)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function FilterPanel({
  open,
  setOpen,
  selectedCategory,
  setSelectedCategory,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onlyStock,
  setOnlyStock,
  onlySale,
  setOnlySale,
  resetFilters,
}: {
  open: { category: boolean; color: boolean; size: boolean; price: boolean };
  setOpen: React.Dispatch<
    React.SetStateAction<{ category: boolean; color: boolean; size: boolean; price: boolean }>
  >;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (value: string) => void;
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  minPrice: number;
  setMinPrice: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  onlyStock: boolean;
  setOnlyStock: (value: boolean) => void;
  onlySale: boolean;
  setOnlySale: (value: boolean) => void;
  resetFilters: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <FaIcon icon="fa-filter" />
          {messages.shop.filterTitle}
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs text-shop hover:underline"
        >
          {messages.shop.clearFilter}
        </button>
      </div>

      <FilterBox
        title={messages.shop.filterCategory}
        open={open.category}
        onToggle={() => setOpen((value) => ({ ...value, category: !value.category }))}
      >
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => setSelectedCategory("")}
              className="accent-shop"
            />
            {messages.shop.allModels}
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => setSelectedCategory(category.id)}
                className="accent-shop"
              />
              {category.label}
            </label>
          ))}
        </div>
      </FilterBox>

      <FilterBox
        title={messages.shop.filterColor}
        open={open.color}
        onToggle={() => setOpen((value) => ({ ...value, color: !value.color }))}
      >
        <div className="flex flex-wrap gap-2">
          {colorFilters.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() =>
                setSelectedColor(selectedColor === color.value ? "" : color.value)
              }
              className="flex w-12 flex-col items-center gap-1"
              aria-pressed={selectedColor === color.value}
            >
              <span
                className={`size-8 rounded-full border ${
                  selectedColor === color.value ? "ring-2 ring-shop" : "border-line"
                }`}
                style={{ background: color.value }}
              />
              <span className="text-[10px] text-muted">{color.label}</span>
            </button>
          ))}
        </div>
      </FilterBox>

      <FilterBox
        title={messages.shop.filterSize}
        open={open.size}
        onToggle={() => setOpen((value) => ({ ...value, size: !value.size }))}
      >
        <div className="flex flex-wrap gap-2">
          {sizeFilters.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
              className={`min-h-9 rounded-md px-2.5 py-1 text-xs ${
                selectedSize === size
                  ? "bg-espresso text-white"
                  : "bg-page text-ink"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterBox>

      <FilterBox
        title={messages.shop.filterPrice}
        open={open.price}
        onToggle={() => setOpen((value) => ({ ...value, price: !value.price }))}
      >
        <div className="px-1 pt-2">
          <div className="relative h-6">
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={50000}
              value={minPrice}
              onChange={(event) =>
                setMinPrice(Math.min(Number(event.target.value), maxPrice))
              }
              className="price-range"
            />
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={50000}
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(Math.max(Number(event.target.value), minPrice))
              }
              className="price-range"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted">
            <span>{minPrice.toLocaleString("fa-IR")} ریال</span>
            <span>{maxPrice.toLocaleString("fa-IR")} ریال</span>
          </div>
          <div className="mt-3 flex justify-between text-[11px]">
            <span className="rounded-md bg-sage/15 px-2 py-1 text-sage">
              {messages.shop.cheapest}
            </span>
            <span className="rounded-md bg-sale/10 px-2 py-1 text-sale">
              {messages.shop.mostExpensive}
            </span>
          </div>
        </div>
      </FilterBox>

      <div className="space-y-3 rounded-xl bg-surface p-4">
        <Toggle
          label={messages.shop.onlyStock}
          checked={onlyStock}
          onChange={setOnlyStock}
        />
        <Toggle
          label={messages.shop.onlySale}
          checked={onlySale}
          onChange={setOnlySale}
        />
      </div>
    </>
  );
}

function sortProducts(a: Product, b: Product, sort: SortKey) {
  if (sort === "cheap") {
    return a.price - b.price;
  }
  if (sort === "expensive") {
    return b.price - a.price;
  }
  if (sort === "newest") {
    return Number(b.id) - Number(a.id);
  }
  return Number(a.id) - Number(b.id);
}

function FilterBox({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-sm"
      >
        {title}
        <FaIcon icon={open ? "fa-chevron-up" : "fa-chevron-down"} />
      </button>
      {open ? <div className="border-t border-line px-4 py-3">{children}</div> : null}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-shop" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-bone transition ${
            checked ? "end-0.5" : "start-0.5"
          }`}
        />
      </button>
    </label>
  );
}
