import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { getWishlistAction } from "@/src/app/(dashboardRoute)/(commonProtectedLayout)/wishlist/_actions/wishlist.action";
import { WishlistView } from "@/components/modules/wishlist/WishlistView";

export const metadata: Metadata = {
    title: "My Watchlist | FilmRank Dashboard",
    description: "Manage, stream trailers, and curate your personal cinema collection on FilmRank.",
};

export default async function DashboardWatchlistPage() {
    const user = await getMeAction();

    if (!user) {
        redirect("/login");
    }

    const initialWishlist = await getWishlistAction();

    return (
        <div className="py-2">
            <WishlistView initialItems={initialWishlist} />
        </div>
    );
}
