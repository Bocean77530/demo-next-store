export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // asc
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2025-10/graphql.json";

/**
 * Configuration for metafield-based filters
 * Maps metafield namespace and key to filter group labels
 * 
 * Example:
 * { namespace: "custom", key: "color", label: "Color" }
 * 
 * This will create a filter group labeled "Color" from metafields
 * with namespace "custom" and key "color"
 */
export type MetafieldFilterConfig = {
  namespace: string;
  key: string;
  label: string;
};

export const METAFIELD_FILTER_CONFIG: MetafieldFilterConfig[] = [
  // Add your metafield configurations here
  // Example:
  // { namespace: "custom", key: "color", label: "Color" },
  // { namespace: "custom", key: "material", label: "Material" },
  { namespace: "custom", key: "colors", label: "Colors" },
  { namespace: "custom", key: "length", label: "Length" },
];

/**
 * Generate metafield identifiers array for GraphQL queries
 * Returns an array of { namespace, key } objects from METAFIELD_FILTER_CONFIG
 */
export function getMetafieldIdentifiers(): Array<{ namespace: string; key: string }> {
  return METAFIELD_FILTER_CONFIG.map((config) => ({
    namespace: config.namespace,
    key: config.key,
  }));
}
