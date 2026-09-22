import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { getAdminStatsAction } from "./_action/getAdminStats.action";
import { getAllCastsAction } from "./cast-management/_action/getAllCasts.action";
import { getAllDirectorsAction } from "./director-management/_action/getAllDirectors.action";
import { getAllWebSeriesAction } from "./web-series-management/_action/getAllWebSeries.action";
import { getAllBannersAction } from "./banner-management/_action/getAllBanners.action";
import { AdminOverviewView } from "@/components/modules/dashboard/admin/AdminOverviewView";

export const metadata: Metadata = {
    title: "Admin Dashboard Overview | FilmRank",
    description: "Executive analytics, revenue tracking, review velocity, and catalogue metrics for FilmRank administrators.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const user = await getMeAction();

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
        redirect("/dashboard");
    }

    const [stats, castsResult, directorsResult, webSeriesResult, bannersResult] = await Promise.all([
        getAdminStatsAction(),
        getAllCastsAction({ limit: 1 }),
        getAllDirectorsAction({ limit: 1 }),
        getAllWebSeriesAction({ limit: 1 }),
        getAllBannersAction(),
    ]);

    const extraCounts = {
        totalCast: castsResult?.meta?.total ?? (Array.isArray(castsResult?.data) ? castsResult.data.length : 0),
        totalDirectors: directorsResult?.meta?.total ?? (Array.isArray(directorsResult?.data) ? directorsResult.data.length : 0),
        totalWebSeries: webSeriesResult?.meta?.total ?? (Array.isArray(webSeriesResult?.data) ? webSeriesResult.data.length : 0),
        totalBanners: bannersResult?.length ?? 0,
    };

    return (
        <AdminOverviewView
            currentUser={user}
            initialStats={stats}
            extraCounts={extraCounts}
        />
    );
}
