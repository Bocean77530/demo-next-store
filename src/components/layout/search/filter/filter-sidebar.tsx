import { Suspense } from "react";
import { FilterGroup } from "./filter-group";
import { ActiveFiltersList } from "./active-filters";
import { ClearFiltersButton } from "./clear-filters-button";
import { FilterGroup as FilterGroupType, ActiveFilters } from "@/lib/filters/types";
import { parseFiltersFromSearchParams, buildFilterQuery, getActiveFiltersFromProducts, productMatchesAllFilters } from "@/lib/filters/utils";
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

  // Build filter query with all current filters
  const filterQuery = buildFilterQuery(filters, searchQuery);
  
  // Get filtered products for counts (this includes product type filter if active)
  let filteredProducts = await getProducts({
    sortKey,
    reverse,
    query: filterQuery || searchQuery,
  });

  filteredProducts = filteredProducts.filter((product) =>
    productMatchesAllFilters(product, filters)
  );

  // Get all product types from ALL products (no filters at all) to show all available types
  // Only apply search query if it exists, otherwise get all products
  const allProducts = await getProducts({
    sortKey,
    reverse,
    query: searchQuery || undefined, // Only search query, no other filters
  });

  // Extract all product types from all products
  const { productTypes: allProductTypes } = getActiveFiltersFromProducts(allProducts);
  
  // Extract counts from filtered products (these will be 0 for types not in filtered results)
  const { options, productTypes: filteredProductTypes, priceRange } = getActiveFiltersFromProducts(filteredProducts);
  
  // Merge: use all product types, but counts from filtered products
  // This ensures we show all types, but with accurate counts based on current filters
  const productTypes = new Map<string, number>();
  allProductTypes.forEach((count, productType) => {
    productTypes.set(productType, filteredProductTypes.get(productType) || 0);
  });

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log("[Filter Debug]", {
      allProductTypes: Array.from(allProductTypes.entries()),
      filteredProductTypes: Array.from(filteredProductTypes.entries()),
      mergedProductTypes: Array.from(productTypes.entries()),
      activeFilters: filters.productType,
      filteredProductsCount: filteredProducts.length,
      allProductsCount: allProducts.length,
    });
  }

  // Build filter groups
  const filterGroups: FilterGroupType[] = [];

  // Collections filter group - show all collections regardless of current filters
  if (collections.length > 0) {
    const collectionOptions = collections
      .filter((collection) => collection.handle !== "") // Filter out "All" collection
      .map((collection) => ({
        value: collection.handle,
        label: collection.title,
      }));

    // Always show collections filter group if there are any collections
    // (not filtered by current product results)
    if (collectionOptions.length > 0) {
      filterGroups.push({
        id: "collections",
        label: "Collections",
        type: "collection",
        options: collectionOptions,
      });
    }
  }

  // Product Type filter group
  if (productTypes.size > 0) {
    const productTypeOptions = Array.from(productTypes.entries())
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Always show product type filter group if there are any product types
    // (0 count filtering is handled in CheckboxFilter component)
    filterGroups.push({
      id: "productType",
      label: "Product Type",
      type: "productType",
      options: productTypeOptions,
    });
  }

  // Options filter groups (e.g., Material, Size, Color, etc.)
  Array.from(options.entries()).forEach(([optionName, valueMap]) => {
    const optionValues = Array.from(valueMap.entries())
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Always show option filter groups if there are any values
    // (0 count filtering is handled in CheckboxFilter component)
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

