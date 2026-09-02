// src/app/(dashboardRoute)/layout.tsx
import { redirect } from "next/navigation"
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action"

export default async function DashboardRouteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getMeAction()

    if (!user) {
        redirect("/login")
    }

    return <>{children}</>
}