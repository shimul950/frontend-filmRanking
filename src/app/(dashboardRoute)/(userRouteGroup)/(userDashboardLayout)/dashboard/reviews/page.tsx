import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { getUserReviewsAction } from "./_actions/userReviews.action";
import { UserReviewsView } from "@/components/modules/dashboard/user/UserReviewsView";

export const metadata: Metadata = {
    title: "My Film Reviews & Ratings | FilmRank",
    description: "Manage, edit, and organize all your film reviews, community ratings, and critic scores on FilmRank.",
};

export default async function UserReviewsPage() {
    const user = await getMeAction();

    if (!user) {
        redirect("/login");
    }

    const reviews = await getUserReviewsAction();

    return <UserReviewsView initialReviews={reviews} />;
}
