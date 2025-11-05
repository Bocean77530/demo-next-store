import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { getCollectionProducts, getProducts } from "@/lib/shopify";
import { parseFiltersFromSearchParams, buildFilterQuery } from "@/lib/filters/utils";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const urlParams = new URLSearchParams(
    Object.entries(searchParams || {}).flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => [key, v]);
      }
      return [[key, value || ""]];
    })
  );

  const { sort, q: searchValue } = Object.fromEntries(urlParams);
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Parse filters (collection comes from pathname)
  const filters = parseFiltersFromSearchParams(urlParams, `/search/${params.collection}`);

  // Build filter query
  const filterQuery = buildFilterQuery(filters, searchValue);

  // Use getProducts with filters if there are additional filters beyond collection
  const hasAdditionalFilters =
    filters.tags.length > 0 ||
    filters.price !== undefined ||
    Object.keys(filters.options).length > 0 ||
    !!searchValue;

  let products = hasAdditionalFilters
    ? await getProducts({
        sortKey,
        reverse,
        query: filterQuery || `collection:${params.collection}`,
      })
    : await getCollectionProducts({
        collection: params.collection,
        sortKey,
        reverse,
      });

  // Apply price filter client-side if needed (Shopify query might not support price filtering)
  if (filters.price && products.length > 0) {
    products = products.filter((product) => {
      const productMinPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
      const productMaxPrice = parseFloat(product.priceRange?.maxVariantPrice?.amount || "0");
      
      if (filters.price?.min !== undefined && productMaxPrice < filters.price.min) {
        return false;
      }
      if (filters.price?.max !== undefined && productMinPrice > filters.price.max) {
        return false;
      }
      return true;
    });
  }

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <>
          <p className="mb-4">
            Showing {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        </>
      )}
    </section>
  );
}
