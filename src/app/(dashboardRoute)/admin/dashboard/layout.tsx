// src/app/(dashboardRoute)/admin/dashboard/layout.tsx
import { redirect } from "next/navigation"
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

import { DashboardHeader } from "@/components/modules/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/modules/dashboard/user/DashboardSidebar"
import { AdminSidebar } from "@/components/modules/dashboard/admin/AdminSidebar"


export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getMeAction()

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
        redirect("/dashboard")
    }

    const dashboardTitle = user.role === "SUPER_ADMIN"? "Super Admin" : "Admin"

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <DashboardHeader title = {dashboardTitle}/>
                <div className="flex-1 p-4 md:p-6">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}