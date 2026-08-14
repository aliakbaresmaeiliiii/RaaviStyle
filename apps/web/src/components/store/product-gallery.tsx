"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaIcon } from "@/components/fa-icon";
import { messages } from "@/lib/i18n";
import { isWishlisted, toggleWishlist } from "@/lib/lists";

type ProductGalleryProps = {
  productId: string;
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

export function ProductGallery({
  productId,
  title,
  images,
  colorName,
}: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [compare, setCompare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(false);
  const current = images[index] ?? images[0];

  const go = useCallback(
    (step: number) => {
      setIndex((value) => (value + step + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setZoom(false);
      }
      if (event.key === "ArrowLeft") {
        go(1);
      }
      if (event.key === "ArrowRight") {
        go(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    setWishlist(isWishlisted(productId));
  }, [productId]);

  async function onAction(id: (typeof actions)[number]["id"]) {
    if (id === "wishlist") {
      setWishlist(toggleWishlist(productId));
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
        <div className="relative aspect-3/4 overflow-hidden rounded-[28px] bg-soft">
          <Image
            src={current}
            alt={`${title} — ${messages.shop.imageIndex(index + 1, images.length)}`}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
          <span className="absolute right-4 bottom-4 rounded-lg bg-surface/95 px-3 py-1.5 text-xs shadow-sm">
            {colorName}
          </span>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-surface/90 text-ink shadow-sm"
                aria-label={messages.shop.prevImage}
              >
                <FaIcon icon="fa-chevron-right" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-soft text-ink"
                aria-label={messages.shop.nextImage}
              >
                <FaIcon icon="fa-chevron-left" />
              </button>
            </>
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
                className={`flex size-10 items-center justify-center rounded-xl border border-line bg-surface text-sm shadow-sm transition hover:border-mocha ${
                  active ? "text-sale" : "text-ink"
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

      <p className="sr-only" aria-live="polite">
        {messages.shop.imageIndex(index + 1, images.length)}
      </p>

      {copied ? (
        <p className="mt-2 text-xs text-shop" role="status">
          {messages.shop.linkCopied}
        </p>
      ) : null}

      <div className="mt-4 flex gap-3" role="listbox" aria-label={title}>
        {images.map((image, imageIndex) => (
          <button
            key={image}
            type="button"
            role="option"
            aria-selected={index === imageIndex}
            onClick={() => setIndex(imageIndex)}
            className={`relative h-20 w-16 overflow-hidden rounded-2xl bg-soft ${
              index === imageIndex ? "ring-2 ring-mocha" : "ring-1 ring-line"
            }`}
            aria-label={messages.shop.imageIndex(imageIndex + 1, images.length)}
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
          <button
            key={`${image}-dot`}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className={`size-2.5 rounded-full ${
              index === imageIndex ? "bg-espresso" : "bg-line"
            }`}
            aria-label={messages.shop.imageIndex(imageIndex + 1, images.length)}
          />
        ))}
      </div>

      {zoom ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoom(false)}
          role="dialog"
          aria-modal="true"
          aria-label={messages.shop.zoom}
        >
          <button
            type="button"
            className="absolute top-4 left-4 flex size-11 items-center justify-center rounded-full bg-surface text-ink"
            aria-label={messages.shop.close}
            onClick={() => setZoom(false)}
          >
            <FaIcon icon="fa-xmark" />
          </button>
          <div className="relative h-[80vh] w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
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
