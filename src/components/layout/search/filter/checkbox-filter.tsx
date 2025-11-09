"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import { addFilterToSearchParams, removeFilterFromSearchParams } from "@/lib/filters/utils";
import { FilterValue, FilterOption, FilterType } from "@/lib/filters/types";
import { Check } from "lucide-react";

export function CheckboxFilter({
  label,
  options,
  filterKey,
  filterType,
  activeValues = [],
}: {
  label: string;
  options: FilterOption[];
  filterKey: string;
  filterType: FilterType;
  activeValues?: string[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get active values directly from URL params to ensure immediate updates
  const getActiveValuesFromParams = (): string[] => {
    switch (filterType) {
      case "tag":
        return searchParams.getAll("tag");
      case "collection":
        // For collections, check the pathname instead of query params
        // Extract collection from pathname like /search/[collection]
        const pathSegments = pathname.split("/");
        const collectionFromPath = pathSegments[pathSegments.length - 1];
        // If we're on a collection page, return that collection
        if (collectionFromPath && collectionFromPath !== "search") {
          return [collectionFromPath];
        }
        return [];
      case "productType":
        return searchParams.getAll("filter.p.product_type");
      case "option":
        return searchParams.getAll(`option:${filterKey}`);
      default:
        return activeValues;
    }
  };

  const currentActiveValues = getActiveValuesFromParams();

  return (
    <div className="space-y-2">
      {options
        .filter((option) => {
          // Always show active options, even if count is 0
          const isActive = currentActiveValues.includes(option.value) || activeValues.includes(option.value);
          // For collections (no count), always show
          if (option.count === undefined) {
            return true;
          }
          // Hide inactive options with 0 count
          return isActive || option.count > 0;
        })
        .map((option) => {
          // Use URL params for active state, fallback to prop if needed
          const isActive = currentActiveValues.includes(option.value) || activeValues.includes(option.value);
          const filter: FilterValue = {
            type: filterType,
            key: filterKey,
            value: option.value,
            label: option.label || option.value,
          };

          // For collections, use path-based routing instead of query params
          let href: string;
          if (filterType === "collection") {
            if (isActive) {
              // If clicking on active collection, go back to /search
              href = "/search";
            } else {
              // Navigate to the collection page
              href = `/search/${option.value}`;
            }
          } else {
            // For other filters, use query params
            const newParams = isActive
              ? removeFilterFromSearchParams(searchParams, filter)
              : addFilterToSearchParams(searchParams, filter);
            href = createUrl(pathname, newParams);
          }

          return (
            <Link
              key={option.value}
              href={href}
              className="flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                  isActive
                    ? "border-neutral-900 bg-neutral-900 dark:border-neutral-100 dark:bg-neutral-100"
                    : "border-neutral-300 bg-white dark:border-neutral-600"
                }`}
              >
                {isActive && (
                  <Check
                    className={`h-3 w-3 ${
                      isActive
                        ? "text-white dark:text-neutral-900"
                        : "text-transparent"
                    }`}
                  />
                )}
              </div>
              <span className="flex-1">{option.label || option.value}</span>
              {option.count !== undefined && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  ({option.count})
                </span>
              )}
            </Link>
          );
        })}
    </div>
  );
}

