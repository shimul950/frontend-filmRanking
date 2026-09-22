import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { getUserStatsAction } from "./_actions/userStats.action";
import { getUserReviewsAction } from "./reviews/_actions/userReviews.action";
import { getWishlistAction } from "@/src/app/(dashboardRoute)/(commonProtectedLayout)/wishlist/_actions/wishlist.action";
import { UserOverviewView } from "@/components/modules/dashboard/user/UserOverviewView";

export const metadata: Metadata = {
    title: "User Dashboard Overview | FilmRank",
    description: "Personal film profile, critic ratings, watchlist metrics, and community activity.",
};

export default async function UserDashboardPage() {
    const user = await getMeAction();

    if (!user) {
        redirect("/login");
    }

    const [stats, reviews, watchlist] = await Promise.all([
        getUserStatsAction(),
        getUserReviewsAction(),
        getWishlistAction(),
    ]);

    return (
        <UserOverviewView
            currentUser={user}
            stats={stats}
            fallbackReviews={reviews}
            fallbackWatchlist={watchlist}
        />
    );
}
