"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import { useState, useEffect, useTransition } from "react";
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
    activeRange?.min?.toString() || ""
  );
  const [localMax, setLocalMax] = useState(
    activeRange?.max?.toString() || ""
  );
  const [isPending, startTransition] = useTransition();

  // Update local state when URL params change
  useEffect(() => {
    setLocalMin(activeRange?.min?.toString() || "");
    setLocalMax(activeRange?.max?.toString() || "");
  }, [activeRange?.min, activeRange?.max]);

  const applyPriceFilter = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (localMin) {
      newParams.set("minPrice", localMin);
    } else {
      newParams.delete("minPrice");
    }
    
    if (localMax) {
      newParams.set("maxPrice", localMax);
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
    setLocalMin("");
    setLocalMax("");
    window.location.href = createUrl(pathname, newParams);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          min={minPrice}
          max={maxPrice}
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="w-full rounded border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-400"
        />
        <span className="text-neutral-500 dark:text-neutral-400">-</span>
        <input
          type="number"
          placeholder="Max"
          min={minPrice}
          max={maxPrice}
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="w-full rounded border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-400"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={applyPriceFilter}
          disabled={isPending}
          className="flex-1 rounded bg-neutral-900 px-3 py-1.5 text-sm text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Apply
        </button>
        {activeRange && (activeRange.min !== undefined || activeRange.max !== undefined) && (
          <button
            onClick={clearPriceFilter}
            className="rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Clear
          </button>
        )}
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Range: ${minPrice} - ${maxPrice}
      </p>
    </div>
  );
}

