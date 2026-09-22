import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsLoading() {
    return (
        <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
            <div className="h-64 rounded-3xl bg-muted/40 animate-pulse" />
            <div className="h-14 rounded-2xl bg-muted/40 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
            </div>
        </main>
    );
}
