import { Skeleton } from "@/components/ui/skeleton";

export default function MovieManagementLoading() {
    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-white/10 pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-zinc-800" />
                    <Skeleton className="h-8 w-64 bg-zinc-800" />
                    <Skeleton className="h-4 w-96 bg-zinc-800" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 bg-zinc-800 rounded-xl" />
                    <Skeleton className="h-9 w-32 bg-zinc-800 rounded-xl" />
                </div>
            </div>

            {/* Metric KPI cards skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 bg-zinc-900/60 rounded-2xl border border-white/5" />
                ))}
            </div>

            {/* Filter bar skeleton */}
            <Skeleton className="h-16 bg-zinc-900/60 rounded-2xl border border-white/5" />

            {/* Movie cards grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-80 bg-zinc-900/60 rounded-2xl border border-white/5" />
                ))}
            </div>
        </div>
    );
}
