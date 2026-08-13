"use client";

import Image from "next/image";
import { useState } from "react";
import { FaIcon } from "@/components/fa-icon";
import { messages } from "@/lib/i18n";

type ProductGalleryProps = {
  title: string;
  images: string[];
  colorName: string;
};

const actions = [
  { id: "wishlist", icon: "fa-heart", label: messages.shop.wishlist },
  { id: "share", icon: "fa-share-nodes", label: messages.shop.share },
  { id: "compare", icon: "fa-code-compare", label: messages.shop.compare },
  { id: "zoom", icon: "fa-expand", label: messages.shop.zoom },
] as const;

export function ProductGallery({ title, images, colorName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [compare, setCompare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(false);
  const current = images[index] ?? images[0];

  function go(step: number) {
    setIndex((value) => (value + step + images.length) % images.length);
  }

  async function onAction(id: (typeof actions)[number]["id"]) {
    if (id === "wishlist") {
      setWishlist((value) => !value);
      return;
    }
    if (id === "compare") {
      setCompare((value) => !value);
      return;
    }
    if (id === "zoom") {
      setZoom(true);
      return;
    }
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div>
      <div className="relative">
        <div className="relative aspect-3/4 overflow-hidden rounded-[28px] bg-[#f3f3f3]">
          <Image
            src={current}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
          <span className="absolute right-4 bottom-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs shadow-sm">
            {colorName}
          </span>
          {images.length > 1 ? (
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[#e8d7c3] text-espresso"
              aria-label={messages.shop.nextImage}
            >
              <FaIcon icon="fa-chevron-left" />
            </button>
          ) : null}
        </div>

        <div className="absolute top-4 right-3 z-10 flex flex-col gap-2">
          {actions.map((action) => {
            const active =
              (action.id === "wishlist" && wishlist) ||
              (action.id === "compare" && compare);
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onAction(action.id)}
                className={`flex size-10 items-center justify-center rounded-xl border border-line bg-white text-sm shadow-sm transition hover:border-mocha ${
                  active ? "text-sale" : "text-espresso"
                }`}
                aria-label={action.label}
                aria-pressed={active}
              >
                <FaIcon icon={action.icon} />
              </button>
            );
          })}
        </div>
      </div>

      {copied ? (
        <p className="mt-2 text-xs text-shop">{messages.shop.linkCopied}</p>
      ) : null}

      <div className="mt-4 flex gap-3">
        {images.map((image, imageIndex) => (
          <button
            key={image}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className={`relative h-20 w-16 overflow-hidden rounded-2xl bg-[#f3f3f3] ${
              index === imageIndex ? "ring-2 ring-mocha" : "ring-1 ring-line"
            }`}
            aria-label={`${title} ${imageIndex + 1}`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {images.map((image, imageIndex) => (
          <span
            key={`${image}-dot`}
            className={`size-1.5 rounded-full ${
              index === imageIndex ? "bg-espresso" : "bg-line"
            }`}
          />
        ))}
      </div>

      {zoom ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoom(false)}
        >
          <button
            type="button"
            className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-white text-espresso"
            aria-label={messages.shop.close}
          >
            <FaIcon icon="fa-xmark" />
          </button>
          <div className="relative h-[80vh] w-full max-w-2xl">
            <Image
              src={current}
              alt={title}
              fill
              sizes="80vw"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
