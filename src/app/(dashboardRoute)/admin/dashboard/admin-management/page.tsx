import AdminManagementTable from "@/components/modules/dashboard/super_admin/AdminManagementTable";


export default function AdminManagementPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Admin Management</h1>
                <p className="text-muted-foreground">
                    View and manage administrator accounts.
                </p>
            </div>
            <AdminManagementTable />
        </div>
    )
}