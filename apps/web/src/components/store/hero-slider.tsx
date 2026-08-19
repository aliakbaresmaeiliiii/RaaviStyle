"use client";

import Image from "next/image";
import { Autoplay, Keyboard, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

type HeroSliderProps = {
  images: string[];
  alt?: string;
};

export function HeroSlider({ images, alt = "" }: HeroSliderProps) {
  if (!images.length) {
    return null;
  }

  return (
    <section dir="rtl" className="relative overflow-hidden rounded-[1.75rem]">
      <Swiper
        modules={[Autoplay, Pagination, Keyboard, A11y]}
        slidesPerView={1}
        spaceBetween={24}
        loop={images.length > 1}
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
        className="hero-banner-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={`banner-${index}`}>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] sm:aspect-[16/8]">
              <Image
                src={image}
                alt={alt || `banner ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>
        {`
          .hero-banner-swiper {
            padding-bottom: 34px !important;
          }

          .hero-banner-swiper .swiper-pagination {
            bottom: 0 !important;
          }

          .hero-banner-swiper .swiper-pagination-bullet {
            width: 7px;
            height: 7px;
            opacity: 0.3;
            background: #e72d32;
            transition: all 0.3s ease;
          }

          .hero-banner-swiper .swiper-pagination-bullet-active {
            width: 20px;
            border-radius: 999px;
            opacity: 1;
          }
        `}
      </style>
    </section>
  );
}