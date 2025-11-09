"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import { removeFilterFromSearchParams, clearAllFilters, parseFiltersFromSearchParams } from "@/lib/filters/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FilterValue } from "@/lib/filters/types";

export function ActiveFiltersList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read filters directly from URL params to ensure immediate updates
  const filters = parseFiltersFromSearchParams(searchParams, pathname);
  const activeFilters: FilterValue[] = [];

  // Add tag filters
  filters.tags.forEach((tag) => {
    activeFilters.push({
      type: "tag",
      key: "tag",
      value: tag,
      label: tag,
    });
  });

  // Add collection filters (check pathname for active collection)
  const pathSegments = pathname.split("/");
  const collectionFromPath = pathSegments[pathSegments.length - 1];
  if (collectionFromPath && collectionFromPath !== "search") {
    // Try to get a better label if available, otherwise use the handle
    activeFilters.push({
      type: "collection",
      key: "collection",
      value: collectionFromPath,
      label: collectionFromPath, // You can enhance this to show collection title if needed
    });
  }

  // Add product type filters
  if (filters.productType) {
    filters.productType.forEach((productType) => {
      activeFilters.push({
        type: "productType",
        key: "productType",
        value: productType,
        label: productType,
      });
    });
  }

  // Add option filters
  Object.entries(filters.options).forEach(([optionName, values]) => {
    values.forEach((value) => {
      activeFilters.push({
        type: "option",
        key: optionName,
        value: value,
        label: `${optionName}: ${value}`,
      });
    });
  });

  // Add price filter
  if (filters.price) {
    const priceLabel =
      filters.price.min && filters.price.max
        ? `$${filters.price.min} - $${filters.price.max}`
        : filters.price.min
        ? `$${filters.price.min}+`
        : `$${filters.price.max}`;

    activeFilters.push({
      type: "price",
      key: "price",
      value: "price",
      label: priceLabel,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        Active filters:
      </span>
      {activeFilters.map((filter, index) => {
        // For collections, navigate to /search instead of using query params
        let href: string;
        if (filter.type === "collection") {
          href = "/search";
        } else {
          const newParams = removeFilterFromSearchParams(searchParams, filter);
          href = createUrl(pathname, newParams);
        }

        return (
          <Link
            key={`${filter.type}-${filter.value}-${index}`}
            href={href}
            className="group flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:bg-neutral-700"
          >
            <span>{filter.label}</span>
            <XMarkIcon className="h-3 w-3 opacity-50 group-hover:opacity-100" />
          </Link>
        );
      })}
      {activeFilters.length > 1 && (
        <Link
          href={pathname.includes("/search/") && pathname !== "/search" ? "/search" : createUrl(pathname, clearAllFilters(searchParams, pathname))}
          className="flex items-center gap-1 rounded border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:bg-neutral-700"
        >
          <XMarkIcon className="h-3 w-3" />
          <span>Clear all</span>
        </Link>
      )}
    </div>
  );
}

