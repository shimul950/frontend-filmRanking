import { redirect } from "next/navigation";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";

export default async function GenreManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getMeAction();

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
        redirect("/admin/dashboard");
    }

    return <>{children}</>;
}
