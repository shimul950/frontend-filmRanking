import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementLoading() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-8 w-60" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Metrics Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
            </div>

            {/* Filter Toolbar Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-3 w-full sm:w-auto flex-1">
                    <Skeleton className="h-11 w-full sm:w-80 rounded-xl" />
                    <Skeleton className="h-11 w-36 rounded-xl" />
                </div>
                <Skeleton className="h-10 w-20 rounded-xl" />
            </div>

            {/* User Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-4"
                    >
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                        <div className="pt-2 flex justify-between border-t border-border/30">
                            <Skeleton className="h-5 w-16 rounded-md" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
