"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { createUrl } from "@/lib/utils";
import { useState, useEffect, useTransition, useRef } from "react";
import { parseFiltersFromSearchParams } from "@/lib/filters/utils";

export function PriceFilter({
  minPrice = 0,
  maxPrice = 1000,
}: {
  minPrice?: number;
  maxPrice?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Read active price range directly from URL params
  const filters = parseFiltersFromSearchParams(searchParams, pathname);
  const activeRange = filters.price;
  
  const [localMin, setLocalMin] = useState(
    activeRange?.min ?? minPrice
  );
  const [localMax, setLocalMax] = useState(
    activeRange?.max ?? maxPrice
  );
  const [isPending, startTransition] = useTransition();
  const minSliderRef = useRef<HTMLInputElement>(null);
  const maxSliderRef = useRef<HTMLInputElement>(null);

  // Update local state when URL params change
  useEffect(() => {
    if (activeRange?.min !== undefined) {
      setLocalMin(activeRange.min);
    } else {
      setLocalMin(minPrice);
    }
    if (activeRange?.max !== undefined) {
      setLocalMax(activeRange.max);
    } else {
      setLocalMax(maxPrice);
    }
  }, [activeRange?.min, activeRange?.max, minPrice, maxPrice]);

  // Ensure min doesn't exceed max and vice versa
  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMax);
    setLocalMin(newMin);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMin);
    setLocalMax(newMax);
  };

  const applyPriceFilter = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (localMin > minPrice) {
      newParams.set("minPrice", localMin.toFixed(2));
    } else {
      newParams.delete("minPrice");
    }
    
    if (localMax < maxPrice) {
      newParams.set("maxPrice", localMax.toFixed(2));
    } else {
      newParams.delete("maxPrice");
    }

    startTransition(() => {
      window.location.href = createUrl(pathname, newParams);
    });
  };

  const clearPriceFilter = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("minPrice");
    newParams.delete("maxPrice");
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
    window.location.href = createUrl(pathname, newParams);
  };

  // Calculate percentage for visual track
  const minPercent = ((localMin - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((localMax - minPrice) / (maxPrice - minPrice)) * 100;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Dual Range Slider */}
      <div className="relative h-8">
        {/* Track background */}
        <div className="absolute top-3 h-2 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
        
        {/* Active range track */}
        <div
          className="absolute top-3 h-2 rounded bg-neutral-900 dark:bg-neutral-100"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        
        {/* Min slider */}
        <input
          ref={minSliderRef}
          type="range"
          min={minPrice}
          max={maxPrice}
          step={0.01}
          value={localMin}
          onChange={(e) => handleMinChange(parseFloat(e.target.value))}
          className="absolute top-0 h-8 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110 dark:[&::-webkit-slider-thumb]:bg-neutral-100 [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-neutral-900 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md dark:[&::-moz-range-thumb]:bg-neutral-100"
        />
        
        {/* Max slider */}
        <input
          ref={maxSliderRef}
          type="range"
          min={minPrice}
          max={maxPrice}
          step={0.01}
          value={localMax}
          onChange={(e) => handleMaxChange(parseFloat(e.target.value))}
          className="absolute top-0 h-8 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110 dark:[&::-webkit-slider-thumb]:bg-neutral-100 [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-neutral-900 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md dark:[&::-moz-range-thumb]:bg-neutral-100"
        />
      </div>

      {/* Price display and inputs */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
            Min
          </label>
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            step={0.01}
            value={localMin.toFixed(2)}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || minPrice;
              handleMinChange(Math.max(minPrice, Math.min(value, maxPrice)));
            }}
            className="w-full rounded border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-400"
          />
        </div>
        <span className="mt-6 text-neutral-500 dark:text-neutral-400">-</span>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
            Max
          </label>
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            step={0.01}
            value={localMax.toFixed(2)}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || maxPrice;
              handleMaxChange(Math.max(minPrice, Math.min(value, maxPrice)));
            }}
            className="w-full rounded border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-400"
          />
        </div>
      </div>

      {/* Current range display */}
      <div className="flex items-center justify-between text-sm">

        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Range: {formatPrice(minPrice)} - {formatPrice(maxPrice)}
        </span>
      </div>

      {/* Apply button */}
      <div className="flex gap-2">
        <button
          onClick={applyPriceFilter}
          disabled={isPending}
          className="flex-1 rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Apply
        </button>
        {activeRange && (activeRange.min !== undefined || activeRange.max !== undefined) && (
          <button
            onClick={clearPriceFilter}
            className="rounded border border-neutral-300 px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

