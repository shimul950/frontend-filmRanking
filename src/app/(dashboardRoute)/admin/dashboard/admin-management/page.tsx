import AdminManagementView from "@/components/modules/dashboard/super_admin/AdminManagementView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Administrator Management | Super Admin Dashboard",
    description: "Manage system administrators, provision credentials, and supervise staff access privileges.",
};

export default function AdminManagementPage() {
    return <AdminManagementView />;
}