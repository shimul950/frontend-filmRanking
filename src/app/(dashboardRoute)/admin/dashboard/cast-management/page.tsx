import { Metadata } from "next";
import { getAllCastsAction } from "./_action/getAllCasts.action";
import { CastManagementView } from "@/components/modules/dashboard/cast/CastManagementView";

export const metadata: Metadata = {
    title: "Cast Management | Cinema Hub Admin",
    description: "Manage film cast members, profile photos via ImageKit, and filmography relations.",
};

export const dynamic = "force-dynamic";

export default async function CastManagementPage() {
    const castsResult = await getAllCastsAction({ limit: 100 });
    const initialCasts = castsResult?.data || [];

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <CastManagementView initialCasts={initialCasts} />
        </div>
    );
}
