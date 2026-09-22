import { Metadata } from "next";
import { getAllDirectorsAction } from "./_action/getAllDirectors.action";
import { DirectorManagementView } from "@/components/modules/dashboard/director/DirectorManagementView";

export const metadata: Metadata = {
    title: "Director Management | Cinema Hub Admin",
    description: "Manage movie and series directors, profile photos via ImageKit, and directing credits.",
};

export const dynamic = "force-dynamic";

export default async function DirectorManagementPage() {
    const directorsResult = await getAllDirectorsAction({ limit: 100 });
    const initialDirectors = directorsResult?.data || [];

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <DirectorManagementView initialDirectors={initialDirectors} />
        </div>
    );
}
