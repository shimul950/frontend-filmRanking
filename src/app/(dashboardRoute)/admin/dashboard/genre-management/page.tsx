import GenreManagementView from "@/components/modules/dashboard/genre/GenreManagementView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Genre Management | Admin Dashboard",
    description: "Manage film genres and category blocks in the catalog.",
};

export default function GenreManagementPage() {
    return <GenreManagementView />;
}
