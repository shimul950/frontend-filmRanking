import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { getUserCommentsAction } from "./_actions/userComments.action";
import { UserCommentsView } from "@/components/modules/dashboard/user/UserCommentsView";

export const metadata: Metadata = {
    title: "My Discussion Comments | FilmRank Dashboard",
    description: "Manage, review, and edit your community discussion replies across film reviews on FilmRank.",
};

export default async function UserCommentsPage() {
    const user = await getMeAction();

    if (!user) {
        redirect("/login");
    }

    const comments = await getUserCommentsAction();

    return <UserCommentsView initialComments={comments} />;
}
