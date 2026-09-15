import TagManagementView from "@/components/modules/dashboard/tag/TagManagementView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tag Management | Admin Dashboard",
    description: "Manage editorial tags, tropes, and badges across community reviews and movie discovery.",
};

export default function TagManagementPage() {
    return <TagManagementView />;
}
