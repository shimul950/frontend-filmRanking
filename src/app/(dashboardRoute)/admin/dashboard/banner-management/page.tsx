import { Metadata } from "next";
import { BannerManagementView } from "@/components/modules/dashboard/banner/BannerManagementView";
import { getAllBannersAction } from "./_action/getAllBanners.action";

export const metadata: Metadata = {
    title: "Hero Banner Management | Admin Dashboard",
    description: "Manage homepage hero slides, video spotlights, and cinema promos.",
};

export default async function BannerManagementPage() {
    const banners = await getAllBannersAction();

    return <BannerManagementView initialBanners={banners || []} />;
}
