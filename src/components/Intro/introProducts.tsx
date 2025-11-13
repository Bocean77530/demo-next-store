import { getCollectionProducts } from "@/lib/shopify";
import { getIntroCollection } from "./introCollection";
import IntroProductsCarousel from "./intro-products-carousel";

async function getIntroProducts() {
  const collections = await getIntroCollection();
  const featuredCollection = collections?.[0];

  if (!featuredCollection?.handle) {
    return { collection: undefined, products: [] };
  }

  const products = await getCollectionProducts({
    collection: featuredCollection.handle,
    sortKey: "CREATED_AT",
    reverse: true,
  });

  return {
    collection: featuredCollection,
    products,
  };
}

export default async function IntroProducts() {
  const { collection, products } = await getIntroProducts();

  if (!collection || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-neutral-50 py-12 dark:bg-black dark:bg-linear-to-b dark:from-black dark:via-black/95 dark:to-black">
      <div className="mx-auto max-w-screen-2xl px-4">
        <IntroProductsCarousel
          products={products}
          collectionTitle={collection.title}
          viewAllHref={collection.path ?? `/search/${collection.handle}`}
        />
      </div>
    </section>
  );
}