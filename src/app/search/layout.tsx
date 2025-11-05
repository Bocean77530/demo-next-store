import Footer from "@/components/layout/footer";
import Collections from "@/components/layout/search/collections";
import FilterList from "@/components/layout/search/filter";
import FilterSidebar from "@/components/layout/search/filter/filter-sidebar";
import { sorting } from "@/lib/constants";
import { getCollections } from "@/lib/shopify";
import { Suspense } from "react";

async function FilterSidebarWrapper({
  searchParams,
  pathname,
}: {
  searchParams: URLSearchParams;
  pathname: string;
}) {
  const collections = await getCollections();
  const collectionsList = collections.map((c) => ({
    handle: c.handle,
    title: c.title,
  }));

  return <FilterSidebar searchParams={searchParams} collections={collectionsList} pathname={pathname} />;
}

export default async function SearchLayout({
  children,
  searchParams,
  params: routeParams,
}: {
  children: React.ReactNode;
  searchParams?: { [key: string]: string | string[] | undefined };
  params?: { collection?: string };
}) {
  const urlParams = new URLSearchParams(
    Object.entries(searchParams || {}).flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => [key, v]);
      }
      return [[key, value || ""]];
    })
  );

  // Build pathname from route params
  const pathname = routeParams?.collection 
    ? `/search/${routeParams.collection}`
    : "/search";

  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
        <div className="order-first w-full flex-none md:w-[250px]">
          <Suspense fallback={<div className="h-[400px] animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />}>
            <FilterSidebarWrapper searchParams={urlParams} pathname={pathname} />
          </Suspense>
        </div>
        <div className="order-last min-h-screen w-full md:order-0">
          {children}
        </div>
        <div className="order-0 flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
    </>
  );
}
