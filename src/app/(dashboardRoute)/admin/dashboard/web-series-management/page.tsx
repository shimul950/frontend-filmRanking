import { Metadata } from "next";
import { getAllWebSeriesAction } from "./_action/getAllWebSeries.action";
import { WebSeriesManagementView } from "@/components/modules/dashboard/webSeries/WebSeriesManagementView";

export const metadata: Metadata = {
    title: "Web Series Management | Cinema Hub Admin",
    description: "Manage serialized original titles, seasons, official trailers, and episode catalogs.",
};

export const dynamic = "force-dynamic";

export default async function WebSeriesManagementPage() {
    const result = await getAllWebSeriesAction({ limit: 100 });
    const initialSeries = result?.data || [];

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <WebSeriesManagementView initialSeries={initialSeries} />
        </div>
    );
}
