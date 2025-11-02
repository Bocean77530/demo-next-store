import Link from "next/link";

export const metadata = {
  description:
    "High-performance e-commerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="flex-1">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 border-bottom-b">
        <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
            <div>
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Discover the Latest Fashion Trends
              </h1>
            </div>
            <div className="flex flex-col items-start space-y-4">


            </div>
          </div>
          <img
            src="/banner.png"
            width="1270"
            height="300"
            alt="Hero"
            className="mx-auto rounded-t-xl object-cover"
          />
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 grid place-content-center">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                New Arrivals
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Trending Now
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Check out our latest collection of stylish.
              </p>
            </div>
          </div>
        </div>

      </section>
      <section className="w-full py-12 lg:py-7 bg-[url('/sale-backdrop.svg')] grid place-content-center">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <img src="/sale-banner.svg" alt="sale footer banner" />
          <div className="space-y-3 z-50">
            <div className="bg-white dark:bg-black">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight p-2">
                Explore Our Sale Collection
              </h2>
            </div>
            <div className="bg-white">
              <p className="mx-auto max-w-[600px] text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed p-2">
                Don&apos;t miss out on our amazing deals and discounts.
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
