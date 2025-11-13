import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";
import { parseFiltersFromSearchParams, buildFilterQuery, productMatchesAllFilters } from "@/lib/filters/utils";

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

  products = products.filter((product) =>
    productMatchesAllFilters(product, filters)
  );

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
