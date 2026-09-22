import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSingleWebSeries } from "../_action/getWebSeries.action";
import { WebSeriesDetailsView } from "@/components/modules/webSeries/WebSeriesDetailsView";

interface WebSeriesDetailsPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: WebSeriesDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const series = await getSingleWebSeries(id);

    if (!series) {
        return {
            title: "Web Series Not Found | Cinema Hub",
        };
    }

    return {
        title: `${series.title} (${series.releaseYear}) | Cinema Hub`,
        description: series.synopsis,
    };
}

export const dynamic = "force-dynamic";

export default async function WebSeriesDetailsPage({
    params,
}: WebSeriesDetailsPageProps) {
    const { id } = await params;
    const series = await getSingleWebSeries(id);

    if (!series) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
            <WebSeriesDetailsView series={series} />
        </div>
    );
}
