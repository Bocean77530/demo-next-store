"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import Price from "@/components/price";
import clsx from "clsx";

type IntroProductsCarouselProps = {
  products: Product[];
  collectionTitle: string;
  viewAllHref: string;
};

export default function IntroProductsCarousel({
  products,
  collectionTitle,
  viewAllHref,
}: IntroProductsCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const updateShadows = useCallback(() => {
    const container = listRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setIsAtStart(scrollLeft <= 8);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 8);
  }, []);

  const scrollBy = (direction: "forward" | "backward") => {
    const container = listRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === "forward" ? amount : -amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateShadows();
  }, [updateShadows, products.length]);

  return (
    <div className="relative">
      <div className="mb-8  flex flex-col items-center justify-between gap-4">
        
        <div className="flex flex-col gap-1 items-center text-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollBy("backward")}
                className="flex h-10 w-10 items-center justify-center   text-neutral-900 disabled:pointer-events-none dark:text-white disabled:opacity-30  "
                aria-label="Scroll products backward"
                disabled={isAtStart}
              >
                
                <ChevronLeft/>
              </button>
            <h1 className="text-2xl tracking-wide font-bold uppercase  text-black">
              {collectionTitle}
            </h1>
              <button
                type="button"
                onClick={() => scrollBy("forward")}
                className="flex h-10 w-10 items-center justify-center   text-neutral-900  disabled:pointer-events-none disabled:opacity-30  dark:text-white "
                aria-label="Scroll products forward"
                disabled={isAtEnd}
              >
                <ChevronRight/>
              </button>
          </div>
          

          <Link
              href={viewAllHref}
              prefetch={true}
              className="text-sm font-semibold uppercase text-neutral-900 transition-colors hover:text-neutral-600 hover:underline- dark:text-white dark:hover:text-neutral-300"
          >
            
              View All
          </Link>
          
        </div>

      </div>

      <div
        className={clsx(
          "pointer-events-none absolute inset-y-14 left-0 w-16 bg-linear-to-r from-neutral-50 to-transparent transition-opacity dark:from-black",
          isAtStart ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        className={clsx(
          "pointer-events-none absolute inset-y-14 right-0 w-16 bg-linear-to-l from-neutral-50 to-transparent transition-opacity dark:from-black",
          isAtEnd ? "opacity-0" : "opacity-100"
        )}
      />

      <div className="relative">
        <ul
          ref={listRef}
          onScroll={updateShadows}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 pt-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <li
              key={product.handle}
              className="group relative flex w-[220px] flex-none snap-start flex-col md:w-[260px]"
            >
              <Link
                href={`/product/${product.handle}`}
                prefetch={true}
                className="flex h-full flex-col"
              >
                <div className="relative aspect-4/5 overflow-hidden   bg-neutral-100 transition  dark:border-neutral-800 dark:bg-neutral-900 ">
                  {product.featuredImage?.url ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText ?? product.title}
                      fill
                      sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 80vw"
                      className="object-cover transition duration-300 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      No image
                    </div>
                  )}
                  {/* <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-900 shadow-sm backdrop-blur-sm dark:bg-black/70 dark:text-white">
                    New arrival
                  </span> */}
                </div>
                <div className="mt-4 space-y-1 text-left">
                  <h3 className="line-clamp-2 text-sm font-semibold uppercase tracking-tight text-neutral-900 dark:text-white">
                    {product.title}
                  </h3>
                  <Price
                    amount={product.priceRange.maxVariantPrice.amount}
                    currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                    className="text-base font-semibold text-neutral-900 dark:text-white"
                  />
                  <p className="text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {product.availableForSale ? "" : "Sold out"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

