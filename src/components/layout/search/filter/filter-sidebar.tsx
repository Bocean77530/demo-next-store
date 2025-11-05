import { Suspense } from "react";
import { FilterGroup } from "./filter-group";
import { ActiveFiltersList } from "./active-filters";
import { ClearFiltersButton } from "./clear-filters-button";
import { FilterGroup as FilterGroupType, ActiveFilters } from "@/lib/filters/types";
import { parseFiltersFromSearchParams, buildFilterQuery, getActiveFiltersFromProducts } from "@/lib/filters/utils";
import { getProducts } from "@/lib/shopify";
import { defaultSort, sorting } from "@/lib/constants";

async function FilterSidebarContent({
  searchParams,
  collections,
  pathname,
}: {
  searchParams: URLSearchParams;
  collections: Array<{ handle: string; title: string }>;
  pathname: string;
}) {
  const filters = parseFiltersFromSearchParams(searchParams, pathname);
  const { sort, q: searchQuery } = Object.fromEntries(searchParams);
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Build filter query
  const filterQuery = buildFilterQuery(filters, searchQuery);

  // Get products to calculate filter counts
  const products = await getProducts({
    sortKey,
    reverse,
    query: filterQuery || searchQuery,
  });

  // Extract available filters from products
  const { options, priceRange } = getActiveFiltersFromProducts(products);

  // Log all available options for debugging
//   console.log("=== All Available Options ===");
//   console.log("Options Map:", options);
//   Array.from(options.entries()).forEach(([optionName, valueMap]) => {
//     console.log(`Option Name: "${optionName}"`);
//     console.log(`  Values:`, Array.from(valueMap.entries()));
//   });
//   console.log("=============================");

  // Build filter groups
  const filterGroups: FilterGroupType[] = [];

  // Collections filter group
  if (collections.length > 0) {
    const collectionOptions = collections.map((collection) => ({
      value: collection.handle,
      label: collection.title,
    }));

    filterGroups.push({
      id: "collections",
      label: "Collections",
      type: "collection",
      options: collectionOptions,
    });
  }

  // Options filter groups (e.g., Material, Size, etc.)
  Array.from(options.entries()).forEach(([optionName, valueMap]) => {
    const optionValues = Array.from(valueMap.entries())
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    if (optionValues.length > 0) {
      filterGroups.push({
        id: optionName,
        label: optionName,
        type: "option",
        options: optionValues,
      });
    }
  });

  // Price filter group
  if (priceRange.min < priceRange.max) {
    filterGroups.push({
      id: "price",
      label: "Price",
      type: "price",
      options: [],
    });
  }

  return (
    <div className="space-y-6">
      <ActiveFiltersList />
      <ClearFiltersButton />
      <div className="space-y-0">
        {filterGroups.map((group) => (
          <FilterGroup
            key={group.id}
            group={group}
            activeFilters={filters}
            priceRange={priceRange}
          />
        ))}
      </div>
    </div>
  );
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700";

export default function FilterSidebar({
  searchParams,
  collections,
  pathname,
}: {
  searchParams: URLSearchParams;
  collections: Array<{ handle: string; title: string }>;
  pathname: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className={skeleton} />
          <div className={skeleton} />
          <div className={skeleton} />
          <div className={skeleton} />
        </div>
      }
    >
      <FilterSidebarContent searchParams={searchParams} collections={collections} pathname={pathname} />
    </Suspense>
  );
}

