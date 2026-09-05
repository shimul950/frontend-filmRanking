import UserManagementTable from "@/components/modules/dashboard/admin/UserManagementTable";


export default function UserManagementPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="text-muted-foreground">
                    View, search, and manage user accounts.
                </p>
            </div>
            <UserManagementTable />
        </div>
    )
}