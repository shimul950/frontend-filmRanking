import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardSidebar } from "@/components/modules/dashboard/user/DashboardSidebar"
import { DashboardHeader } from "@/components/modules/dashboard/DashboardHeader"

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <DashboardSidebar />
                <SidebarInset>
                    <DashboardHeader />
                    <div className="flex-1 p-4 md:p-6">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}