
import { redirect } from "next/navigation"
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action"

export default async function AdminManagementLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getMeAction()

    if (!user || user.role !== "SUPER_ADMIN") {
        redirect("/admin/dashboard")
    }

    return <>{children}</>
}