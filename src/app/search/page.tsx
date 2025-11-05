import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";
import { parseFiltersFromSearchParams, buildFilterQuery } from "@/lib/filters/utils";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = new URLSearchParams(
    Object.entries(searchParams || {}).flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => [key, v]);
      }
      return [[key, value || ""]];
    })
  );

  const { sort, q: searchValue } = Object.fromEntries(params);
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Parse and build filter query
  const filters = parseFiltersFromSearchParams(params, "/search");
  const filterQuery = buildFilterQuery(filters, searchValue);

  let products = await getProducts({
    sortKey,
    reverse,
    query: filterQuery || searchValue,
  });

  // Apply price filter client-side (Shopify query doesn't support price filtering)
  if (filters.price && products.length > 0) {
    products = products.filter((product) => {
      const productMinPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
      const productMaxPrice = parseFloat(product.priceRange?.maxVariantPrice?.amount || "0");
      
      // Debug logging
      console.log("Price Filter Check:", {
        productTitle: product.title,
        productMinPrice,
        productMaxPrice,
        filterMin: filters.price?.min,
        filterMax: filters.price?.max,
        passes: !(
          (filters.price?.min !== undefined && productMaxPrice < filters.price.min) ||
          (filters.price?.max !== undefined && productMinPrice > filters.price.max)
        ),
      });
      
      // Product passes if its price range overlaps with the filter range
      // Exclude if product's max price is below filter min, or product's min price is above filter max
      if (filters.price?.min !== undefined && productMaxPrice < filters.price.min) {
        return false;
      }
      if (filters.price?.max !== undefined && productMinPrice > filters.price.max) {
        return false;
      }
      return true;
    });
    
    console.log(`Price filter applied: ${products.length} products remaining`);
  }

  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {(searchValue || filters.tags.length > 0 || filters.collections.length > 0 || filters.price || Object.keys(filters.options).length > 0) ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match"
            : `Showing ${products.length} ${resultsText}`}
          {searchValue && (
            <>
              {" for "}
              <span>&quot;{searchValue}&quot;</span>
            </>
          )}
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <p className="py-3 text-lg">No products found</p>
      )}
    </>
  );
}
