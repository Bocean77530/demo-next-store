"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FilterGroup as FilterGroupType } from "@/lib/filters/types";
import { CheckboxFilter } from "./checkbox-filter";
import { PriceFilter } from "./price-filter";
import { ActiveFilters } from "@/lib/filters/types";

export function FilterGroup({
  group,
  activeFilters,
  priceRange,
}: {
  group: FilterGroupType;
  activeFilters: ActiveFilters;
  priceRange?: { min: number; max: number };
}) {
  const [isOpen, setIsOpen] = useState(group.isOpen ?? true);

  return (
    <div className="border-b border-neutral-200 py-4 dark:border-neutral-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {group.label}
        </h3>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-neutral-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4">
          {group.type === "collection" && (
            <CheckboxFilter
              label={group.label}
              options={group.options}
              filterKey="collection"
              filterType="collection"
              activeValues={activeFilters.collections}
            />
          )}

          {group.type === "productType" && (
            <CheckboxFilter
              label={group.label}
              options={group.options}
              filterKey="productType"
              filterType="productType"
              activeValues={activeFilters.productType || []}
            />
          )}

          {group.type === "option" && (
            <CheckboxFilter
              label={group.label}
              options={group.options}
              filterKey={group.id}
              filterType="option"
              activeValues={activeFilters.options[group.id] || []}
            />
          )}

          {group.type === "price" && priceRange && (
            <PriceFilter
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
            />
          )}
        </div>
      )}
    </div>
  );
}

