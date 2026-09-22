import { Metadata } from "next";
import { getPublicReviewsAction } from "./_action/getPublicReviews.action";
import { PublicReviewsView } from "@/components/modules/reviews/PublicReviewsView";

export const metadata: Metadata = {
    title: "Community & Critic Reviews | FilmRank",
    description:
        "Read verified audience reviews, critic perspectives, ratings, and discussions for top cinematic releases on FilmRank.",
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
    const initialData = await getPublicReviewsAction({
        limit: 12,
        page: 1,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    return (
        <main className="container mx-auto px-4 py-8">
            <PublicReviewsView initialData={initialData} />
        </main>
    );
}
