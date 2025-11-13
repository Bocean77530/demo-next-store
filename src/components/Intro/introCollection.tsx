import { getCollections } from "@/lib/shopify";
import { VideoReference } from "@/lib/shopify/types";

export async function getIntroCollection() {
    const collections = await getCollections();
    const introCollection =  collections.filter((c) => c.metafields?.find((m) => m?.key === "isnewrelease" && m.value === "true"));
   
    return introCollection;
}

export default async function IntroCollection() {
    const introCollection = await getIntroCollection();
    const featuredCollection = introCollection?.[0];
    const featuredTitle = featuredCollection?.title;
    const featuredVideo = (featuredCollection?.metafields ?? []).find(
        (m) => m?.key === "showvideo" && m?.reference?.__typename === "Video"
    )?.reference as VideoReference | undefined;

    if (!featuredTitle) return null;
    return (
        <section className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-neutral-900">
            {featuredVideo ? (
                <ShopifyVideo video={featuredVideo} variant="background" />
            ) : null}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
            <div className="relative z-10 px-6 text-center text-white">
                <h2 className="text-4xl font-bold uppercase tracking-[0.4em] drop-shadow-lg md:text-5xl lg:text-6xl">
                    {featuredTitle}
                </h2>
            </div>
        </section>
    )
}

type ShopifyVideoProps = {
    video: VideoReference;
    variant?: "default" | "background";
};

function ShopifyVideo({ video, variant = "default" }: ShopifyVideoProps) {
    const sources = [...(video.sources ?? [])].sort((a, b) =>
        a.mimeType === "video/mp4" ? -1 : b.mimeType === "video/mp4" ? 1 : 0
    );

    if (sources.length === 0) return null;

    if (variant === "background") {
        return (
            <video
                playsInline
                autoPlay
                muted
                loop
                preload="auto"
                poster={video.previewImage?.url}
                className="absolute inset-0 h-full w-full object-cover"
            >
                {sources.map((source) => (
                    <source key={source.url} src={source.url} type={source.mimeType} />
                ))}
            </video>
        );
    }

    return (
        <div className="mt-6">
            <video
                playsInline
                controls
                preload="metadata"
                poster={video.previewImage?.url}
                className="w-full rounded-xl border border-neutral-200 shadow-lg dark:border-neutral-700"
            >
                {sources.map((source) => (
                    <source key={source.url} src={source.url} type={source.mimeType} />
                ))}
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
