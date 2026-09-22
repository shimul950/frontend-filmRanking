import { Metadata } from "next";
import ReviewManagementView from "@/components/modules/dashboard/review/ReviewManagementView";

export const metadata: Metadata = {
    title: "Review Management & Approvals | Admin Dashboard",
    description: "Moderate community reviews, approve ratings, and manage cinema feedback.",
};

export default function ReviewManagementPage() {
    return <ReviewManagementView />;
}
