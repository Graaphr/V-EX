"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import {
  BiSolidRightArrow,
  BiSolidLeftArrow,
} from "react-icons/bi";

/* ===================== */
/* IMPORT JSON */
/* ===================== */
import CarouselData from "@/public/data/Carousel.json";

/* ===================== */
/* TYPE */
/* ===================== */

export interface SlideItem {
  poster: string;
  banner: string;
  title: string;
}

interface CarouselProps {
  type:
    | "DataFotoTerbaik"
    | "DataFotoTerfavorit";

  className?: string;
}

/* ===================== */
/* COMPONENT */
/* ===================== */

export default function Carousel({
  type,
  className,
}: CarouselProps) {
  const [isMobile, setIsMobile] =
    useState(false);

  const [data, setData] =
    useState<SlideItem[]>([]);

  const [emblaRef, emblaApi] =
    useEmblaCarousel(
      { loop: true },
      [
        Autoplay({
          delay: 6000,
          stopOnInteraction: false,
        }),
      ]
    );

  /* ===================== */
  /* LOAD DATA JSON */
  /* ===================== */

  useEffect(() => {
    const jsonData =
      CarouselData[
        type
      ] as SlideItem[];

    setData(jsonData || []);
  }, [type]);

  /* ===================== */
  /* DETECT MOBILE */
  /* ===================== */

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const scrollPrev =
    useCallback(() => {
      emblaApi?.scrollPrev();
    }, [emblaApi]);

  const scrollNext =
    useCallback(() => {
      emblaApi?.scrollNext();
    }, [emblaApi]);

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-200 rounded-xl font-medium">
        Tidak ada foto ditemukan
      </div>
    );
  }

  return (
    <div
      className={`relative group max-w-5xl mx-auto ${className}`}
    >
      {/* CAROUSEL */}
      <div
        className="overflow-hidden rounded-2xl shadow-lg border border-gray-100"
        ref={emblaRef}
      >
        <div className="flex">
          {data.map(
            (item, index) => (
              <div
                key={index}
                className="
                flex-[0_0_100%]
                min-w-0
                relative
                aspect-[3/4]
                md:aspect-video
              "
              >
                <Image
                  src={
                    isMobile
                      ? item.poster
                      : item.banner
                  }
                  alt={
                    item.title
                  }
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={
                    index === 0
                  }
                  sizes="100vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 md:p-8">
                  <p className="text-white font-semibold text-lg md:text-xl">
                    {
                      item.title
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* PREV */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <BiSolidLeftArrow className="text-xl" />
      </button>

      {/* NEXT */}
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <BiSolidRightArrow className="text-xl" />
      </button>
    </div>
  );
}