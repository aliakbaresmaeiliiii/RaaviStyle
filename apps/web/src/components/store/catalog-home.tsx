"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/store/product-card";
import { FaIcon } from "@/components/fa-icon";
import {
  PRICE_MAX,
  categories,
  colorFilters,
  products,
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
  const [sort, setSort] = useState<SortKey>("sales");
  const [open, setOpen] = useState({
    category: true,
    color: false,
    size: false,
    price: true,
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);

  function resetFilters() {
    setSelectedCategory("");
    setSelectedColor("");
    setSelectedSize("");
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setOnlyStock(false);
    setOnlySale(false);
  }

  const filtered = useMemo(() => {
    const next = products.filter((product) => {
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
      if (onlySale && !product.compareAt) {
        return false;
      }
      return true;
    });

    return next.sort((a, b) => sortProducts(a, b, sort));
  }, [
    sort,
    selectedCategory,
    selectedColor,
    selectedSize,
    minPrice,
    maxPrice,
    onlyStock,
    onlySale,
  ]);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-5">
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
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
                : "bg-page text-ink hover:bg-oat"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
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
              {categories.map((category) => (
                <label key={category.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                    className="accent-[#2f6fed]"
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
                  className={`size-7 rounded-full border ${
                    selectedColor === color.value ? "ring-2 ring-shop" : "border-line"
                  }`}
                  style={{ background: color.value }}
                  aria-label={color.label}
                />
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
                  className={`rounded-md px-2.5 py-1 text-xs ${
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
                <span>{minPrice.toLocaleString("fa-IR")} تومان</span>
                <span>{maxPrice.toLocaleString("fa-IR")} تومان</span>
              </div>
              <div className="mt-3 flex justify-between text-[11px]">
                <span className="rounded-md bg-rose-100 px-2 py-1 text-rose-700">
                  {messages.shop.mostExpensive}
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-700">
                  {messages.shop.cheapest}
                </span>
              </div>
            </div>
          </FilterBox>

          <div className="space-y-3 rounded-xl bg-white p-4">
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
        </aside>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </div>
    </main>
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
    <div className="rounded-xl bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-sm"
      >
        {title}
        <FaIcon icon={open ? "fa-chevron-up" : "fa-chevron-down"} />
      </button>
      {open ? <div className="border-t border-[#eee] px-4 py-3">{children}</div> : null}
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
          checked ? "bg-shop" : "bg-[#d9d9d9]"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white transition ${
            checked ? "end-0.5" : "start-0.5"
          }`}
        />
      </button>
    </label>
  );
}
