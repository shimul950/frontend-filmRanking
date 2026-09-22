import { Metadata } from "next";
import { getWebSeries } from "./_action/getWebSeries.action";
import { WebSeriesCatalogView } from "@/components/modules/webSeries/WebSeriesCatalogView";

export const metadata: Metadata = {
    title: "Web Series & TV Shows | Cinema Hub",
    description:
        "Explore serialized original web series, multi-season dramas, season-specific official trailers, and episode breakdowns.",
};

export const dynamic = "force-dynamic";

export default async function WebSeriesPage() {
    const result = await getWebSeries({ limit: 60 });
    const initialSeries = result?.data || [];

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
            <WebSeriesCatalogView initialSeries={initialSeries} />
        </div>
    );
}
