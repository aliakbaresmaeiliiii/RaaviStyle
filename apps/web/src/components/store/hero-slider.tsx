"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, Keyboard, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  categoryLabel,
  discountPercent,
  productImages,
  type Product,
} from "@/lib/catalog";

import "swiper/css";
import "swiper/css/pagination";

type HeroSliderProps = {
  products: Product[];
  title: string;
  href?: string;
};

function chunkProducts(products: Product[], size = 2) {
  const chunks: Product[][] = [];

  for (let i = 0; i < products.length; i += size) {
    chunks.push(products.slice(i, i + size));
  }

  return chunks;
}

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR");
}
function ProductMiniCard({ product }: { product: Product }) {
  const discount = discountPercent(product);
  const colorImages = productImages(product).slice(0, 3);

  return (
    <Link href={product.href} className="group block w-full text-center">
      {/* Image container */}
      <div className="relative aspect-[0.78] overflow-hidden rounded-xl bg-[#e2e7e3]">
        {/* Main image */}
        <div
          className="
              absolute inset-0
              transition-transform
              duration-500
              ease-out
            group-hover:translate-y-[-18%]
            "
        >
          <Image
            src='/products/logo-dark.png'
            alt={product.title}
            fill
            sizes="180px"
            className="object-cover"
          />
        </div>

        {/* Discount */}
        {discount ? (
          <span className="absolute right-2 top-2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#ef3038] text-[10px] font-bold text-white">
            -{discount}%
          </span>
        ) : null}

        {/* Color images */}
        <div
          className="
              absolute
              inset-x-0
              bottom-0
              z-20
              flex
              h-[22%]
              items-center
              justify-center
              gap-2
              bg-white/90
              px-3
              backdrop-blur-sm
  
              translate-y-full
              opacity-0
  
              transition-all
              duration-500
              ease-out
  
              group-hover:translate-y-0
              group-hover:opacity-100
            "
        >
          {colorImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="
                  relative
                  h-[80%]
                  w-[26%]
                  overflow-hidden
                  rounded-md
                  border
                  border-white
                  shadow-sm
                  transition-transform
                  duration-300
                  hover:scale-105
                "
            >
              <Image
                src={product.image[0]}
                alt={`${product.title} ${index + 1}`}
                fill
                sizes="60px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product info */}
      <div className="mt-2">
        <h3 className="truncate text-[13px] font-medium text-[#3d3d3d]">
          {product.title}
        </h3>

        <p className="mt-1 text-[11px] text-[#a6a6a6]">
          {categoryLabel(product.category)}
        </p>

        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-[12px] font-semibold text-[#62a15b]">
            {formatPrice(product.price)}
            <span className="mr-1 text-[9px] font-normal">تومان</span>
          </span>

          {product.compareAt ? (
            <span className="text-[10px] text-[#aaa] line-through">
              {formatPrice(product.compareAt)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
export function HeroSlider({ products }: HeroSliderProps) {
  const slides = chunkProducts(products, 2);
  if (!slides.length) {
    return null;
  }

  return (
    <section dir="rtl" className="relative overflow-hidden bg-[#edf2ec]">
      <div className="mr-auto w-1/2 px-4 py-10 sm:px-6 lg:px-8">
        {" "}
        <Swiper
          modules={[Autoplay, Pagination, Keyboard, A11y]}
          slidesPerView={1}
          spaceBetween={24}
          loop={slides.length > 1}
          speed={650}
          keyboard={{
            enabled: true,
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="hero-sale-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={`sale-slide-${index}`}>
              <div className="flex min-h-80 items-center justify-center">
                <div className="flex w-full justify-center gap-3 sm:gap-5">
                  {slide.map((product) => (
                    <div key={product.id} className="w-1/3 max-w-45">
                      <ProductMiniCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>
        {`
          .hero-sale-swiper {
            padding-bottom: 34px !important;
          }

          .hero-sale-swiper .swiper-pagination {
            bottom: 0 !important;
          }

          .hero-sale-swiper .swiper-pagination-bullet {
            width: 7px;
            height: 7px;
            opacity: 0.3;
            background: #e72d32;
            transition: all 0.3s ease;
          }

          .hero-sale-swiper .swiper-pagination-bullet-active {
            width: 20px;
            border-radius: 999px;
            opacity: 1;
          }
        `}
      </style>
    </section>
  );
}
