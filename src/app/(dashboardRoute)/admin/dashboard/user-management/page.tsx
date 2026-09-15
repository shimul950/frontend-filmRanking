import UserManagementView from "@/components/modules/dashboard/user/UserManagementView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Management | Admin Dashboard",
    description: "View, search, inspect, and manage member accounts and access permissions.",
};

export default function UserManagementPage() {
    return <UserManagementView />;
}