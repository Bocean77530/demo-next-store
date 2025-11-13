import { ActiveFilters, FilterValue, PriceRange } from "./types";

export function parseFiltersFromSearchParams(
  searchParams: URLSearchParams,
  pathname?: string
): ActiveFilters {
  const filters: ActiveFilters = {
    tags: [],
    options: {},
    collections: [],
  };

  
  // Parse tags
  const tagParams = searchParams.getAll("tag");
  if (tagParams.length > 0) {
    filters.tags = tagParams;
  }

  // Parse collections from pathname instead of query params
  if (pathname) {
    const pathSegments = pathname.split("/");
    const collectionFromPath = pathSegments[pathSegments.length - 1];
    if (collectionFromPath && collectionFromPath !== "search") {
      filters.collections = [collectionFromPath];
    }
  }

  // Parse price range
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filters.price = {
      ...(minPrice && { min: parseFloat(minPrice) }),
      ...(maxPrice && { max: parseFloat(maxPrice) }),
    };
  }

  // Parse Shopify native filter format: filter.p.*
  searchParams.forEach((value, key) => {
    // Parse product_type: filter.p.product_type=value
    if (key === "filter.p.product_type") {
      filters.productType = filters.productType || [];
      if (!filters.productType.includes(value)) {
        filters.productType.push(value);
      }
    }
    // Parse option format (e.g., option:material=gold, option:size=large)
    else if (key.startsWith("option:")) {
      const optionName = key.replace("option:", "");
      if (!filters.options[optionName]) {
        filters.options[optionName] = [];
      }
      filters.options[optionName].push(value);
    }
  });

  return filters;
}

export function buildFilterQuery(filters: ActiveFilters, searchQuery?: string): string {
  const queryParts: string[] = [];

  const formatValue = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === "") {
      return '""';
    }
    const escaped = trimmed.replace(/"/g, '\\"');
    return `"${escaped}"`;
  };

  const normalizeOptionName = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

  // Add search query
  if (searchQuery) {
    queryParts.push(searchQuery);
  }

  // Add tag filters
  if (filters.tags.length > 0) {
    const tagQuery = filters.tags
      .filter((tag) => !!tag)
      .map((tag) => `tag:${formatValue(tag)}`)
      .join(" OR ");
    queryParts.push(`(${tagQuery})`);
  }

  // Add collection filters
  if (filters.collections.length > 0) {
    const collectionQuery = filters.collections
      .filter((collection) => !!collection)
      .map((collection) => `collection:${formatValue(collection)}`)
      .join(" OR ");
    queryParts.push(`(${collectionQuery})`);
  }

  // Add product type filters
  if (filters.productType && filters.productType.length > 0) {
    const productTypeQuery = filters.productType
      .filter((type) => !!type)
      .map((type) => `product_type:${formatValue(type)}`)
      .join(" OR ");
    queryParts.push(`(${productTypeQuery})`);
  }

  // Note: Price filters are NOT included in Shopify query
  // Shopify's query syntax doesn't reliably support price filtering
  // Price filtering is handled client-side after fetching products

  // Add option filters
  Object.entries(filters.options).forEach(([optionName, values]) => {
    if (values.length > 0) {
      const optionQuery = values
        .filter((value) => !!value)
        .map(
          (value) =>
            `variant_options.${normalizeOptionName(optionName)}:${formatValue(
              value
            )}`
        )
        .join(" OR ");
      queryParts.push(`(${optionQuery})`);
    }
  });

  const finalQuery = queryParts.join(" AND ");
  
  // Debug logging
  if (filters.price) {
    console.log("Price Filter Debug:", {
      minPrice: filters.price.min,
      maxPrice: filters.price.max,
      minCents: filters.price.min ? Math.round(filters.price.min * 100) : undefined,
      maxCents: filters.price.max ? Math.round(filters.price.max * 100) : undefined,
      finalQuery,
    });
  }

  return finalQuery;
}

export function addFilterToSearchParams(
  searchParams: URLSearchParams,
  filter: FilterValue
): URLSearchParams {
  const newParams = new URLSearchParams(searchParams.toString());

  switch (filter.type) {
    case "tag":
      const existingTags = newParams.getAll("tag");
      if (!existingTags.includes(filter.value)) {
        newParams.append("tag", filter.value);
      }
      break;

    case "collection":
      const existingCollections = newParams.getAll("collection");
      if (!existingCollections.includes(filter.value)) {
        newParams.append("collection", filter.value);
      }
      break;

    case "productType":
      const existingProductTypes = newParams.getAll("filter.p.product_type");
      if (!existingProductTypes.includes(filter.value)) {
        newParams.append("filter.p.product_type", filter.value);
      }
      break;

    case "option":
      const optionKey = `option:${filter.key}`;
      const existingOptions = newParams.getAll(optionKey);
      if (!existingOptions.includes(filter.value)) {
        newParams.append(optionKey, filter.value);
      }
      break;

    case "price":
      // Price is handled separately via minPrice/maxPrice
      break;
  }

  return newParams;
}

export function removeFilterFromSearchParams(
  searchParams: URLSearchParams,
  filter: FilterValue
): URLSearchParams {
  const newParams = new URLSearchParams(searchParams.toString());

  switch (filter.type) {
    case "tag":
      const tags = newParams.getAll("tag");
      newParams.delete("tag");
      tags
        .filter((tag) => tag !== filter.value)
        .forEach((tag) => newParams.append("tag", tag));
      break;

    case "collection":
      const collections = newParams.getAll("collection");
      newParams.delete("collection");
      collections
        .filter((collection) => collection !== filter.value)
        .forEach((collection) => newParams.append("collection", collection));
      break;

    case "productType":
      const productTypes = newParams.getAll("filter.p.product_type");
      newParams.delete("filter.p.product_type");
      productTypes
        .filter((type) => type !== filter.value)
        .forEach((type) => newParams.append("filter.p.product_type", type));
      break;

    case "option":
      const optionKey = `option:${filter.key}`;
      const options = newParams.getAll(optionKey);
      newParams.delete(optionKey);
      options
        .filter((option) => option !== filter.value)
        .forEach((option) => newParams.append(optionKey, option));
      break;

    case "price":
      newParams.delete("minPrice");
      newParams.delete("maxPrice");
      break;
  }

  return newParams;
}

export function clearAllFilters(
  searchParams: URLSearchParams,
  pathname?: string
): URLSearchParams {
  const newParams = new URLSearchParams(searchParams.toString());
  
  // Keep only sort and search query
  const sort = newParams.get("sort");
  const q = newParams.get("q");
  
  // Delete all filter parameters
  newParams.forEach((_, key) => {
    if (
      key.startsWith("filter.p.product_type") ||
      key.startsWith("option:") ||
      key === "tag" ||
      key === "minPrice" ||
      key === "maxPrice"
    ) {
      newParams.delete(key);
    }
  });
  
  if (sort) {
    newParams.set("sort", sort);
  }
  if (q) {
    newParams.set("q", q);
  }
  
  return newParams;
}

export function getActiveFiltersFromProducts(products: any[]): {
  tags: Map<string, number>;
  options: Map<string, Map<string, number>>;
  productTypes: Map<string, number>;
  priceRange: { min: number; max: number };
} {
  const tags = new Map<string, number>();
  const options = new Map<string, Map<string, number>>();
  const productTypes = new Map<string, number>();
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  products.forEach((product) => {
    // Count tags
    product.tags?.forEach((tag: string) => {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    });

    // Count product types
    if (product.productType) {
      productTypes.set(product.productType, (productTypes.get(product.productType) || 0) + 1);
    }

    // Extract options from variants (for variant-based filters like Size, Color, etc.)
    product.variants?.forEach((variant: any) => {
      variant.selectedOptions?.forEach((selectedOption: { name: string; value: string }) => {
        // Skip "Default Title" values
        if (selectedOption.value === "Default Title") {
          return;
        }
        
        const optionName = selectedOption.name;
        const optionValue = selectedOption.value;
        
        if (!options.has(optionName)) {
          options.set(optionName, new Map());
        }
        const optionMap = options.get(optionName)!;
        optionMap.set(optionValue, (optionMap.get(optionValue) || 0) + 1);
      });
    });

    // Track price range
    const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
    if (price > 0) {
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
    }
  });

  return {
    tags,
    options,
    productTypes,
    priceRange: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === -Infinity ? 0 : maxPrice,
    },
  };
}

function variantMatchesOptionFilters(
  variant: any,
  optionFilters: Array<[string, string[]]>
): boolean {
  const selectedOptions: Array<{ name?: string; value?: string }> =
    variant?.selectedOptions || [];

  return optionFilters.every(([optionName, values]) => {
    if (!values || values.length === 0) {
      return true;
    }

    const matchingSelection = selectedOptions.find((selected) => {
      if (!selected?.name) {
        return false;
      }

      return selected.name.toLowerCase() === optionName.toLowerCase();
    });

    if (!matchingSelection?.value) {
      return false;
    }

    return values.includes(matchingSelection.value);
  });
}

export function productMatchesAllFilters(
  product: any,
  filters: ActiveFilters
): boolean {
  if (!product) {
    return false;
  }

  const minVariantPrice = parseFloat(
    product?.priceRange?.minVariantPrice?.amount || "0"
  );
  const maxVariantPrice = parseFloat(
    product?.priceRange?.maxVariantPrice?.amount || "0"
  );

  if (filters.price) {
    if (
      typeof filters.price.min === "number" &&
      maxVariantPrice < filters.price.min
    ) {
      return false;
    }
    if (
      typeof filters.price.max === "number" &&
      minVariantPrice > filters.price.max
    ) {
      return false;
    }
  }

  if (filters.productType && filters.productType.length > 0) {
    if (!filters.productType.includes(product?.productType)) {
      return false;
    }
  }

  const optionFilters = Object.entries(filters.options || {}).filter(
    ([, values]) => Array.isArray(values) && values.length > 0
  );

  if (optionFilters.length > 0) {
    const variants: any[] = product?.variants || [];
    const hasMatchingVariant = variants.some((variant) =>
      variantMatchesOptionFilters(variant, optionFilters)
    );

    if (!hasMatchingVariant) {
      return false;
    }
  }

  return true;
}

