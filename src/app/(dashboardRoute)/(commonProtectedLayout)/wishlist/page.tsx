import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { getWishlistAction } from "./_actions/wishlist.action";
import { WishlistView } from "@/components/modules/wishlist/WishlistView";

export const metadata: Metadata = {
    title: "My Cinema Wishlist | FilmRank",
    description: "Manage, track, and stream your personal saved cinema collection on FilmRank.",
};

export default async function WishlistPage() {
    const user = await getMeAction();

    if (!user) {
        redirect("/login");
    }

    const initialWishlist = await getWishlistAction();

    return (
        <div className="py-2 sm:py-4">
            <WishlistView initialItems={initialWishlist} />
        </div>
    );
}
