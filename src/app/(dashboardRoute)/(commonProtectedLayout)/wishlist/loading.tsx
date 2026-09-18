export default function WishlistLoading() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
            {/* Header Hero Skeleton */}
            <div className="rounded-3xl border border-border/70 bg-card p-8 space-y-6">
                <div className="h-6 w-40 rounded-full bg-muted" />
                <div className="h-10 w-72 rounded-xl bg-muted" />
                <div className="h-4 w-96 rounded-lg bg-muted" />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/60">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 rounded-2xl bg-muted/50 p-4" />
                    ))}
                </div>
            </div>

            {/* Toolbar Skeleton */}
            <div className="h-14 rounded-2xl bg-card border border-border" />

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="aspect-[2/3] w-full bg-muted" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 w-3/4 bg-muted rounded" />
                            <div className="h-3 w-1/2 bg-muted rounded" />
                            <div className="h-8 w-full bg-muted rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
