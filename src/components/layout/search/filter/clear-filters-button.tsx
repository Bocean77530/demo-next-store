"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import { clearAllFilters, parseFiltersFromSearchParams } from "@/lib/filters/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function ClearFiltersButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read filters directly from URL params to ensure immediate updates
  const filters = parseFiltersFromSearchParams(searchParams, pathname);

  // Check if there are any active filters
  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.collections.length > 0 ||
    filters.price !== undefined ||
    Object.keys(filters.options).length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  // If we're on a collection page, redirect to /search instead
  const pathSegments = pathname.split("/");
  const isCollectionPage = pathSegments[pathSegments.length - 1] !== "search";
  
  const newParams = clearAllFilters(searchParams, pathname);
  const href = isCollectionPage 
    ? "/search" 
    : createUrl(pathname, newParams);

  return (
    <Link
      href={href}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    >
      <XMarkIcon className="h-4 w-4" />
      <span>Clear all filters</span>
    </Link>
  );
}

