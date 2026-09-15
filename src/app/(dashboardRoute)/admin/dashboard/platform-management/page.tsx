import PlatformManagementView from "@/components/modules/dashboard/platform/PlatformManagementView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Platform Management | Admin Dashboard",
    description: "Manage streaming providers and broadcasting platforms across the catalog.",
};

export default function PlatformManagementPage() {
    return <PlatformManagementView />;
}
