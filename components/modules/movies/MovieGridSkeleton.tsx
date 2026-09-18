import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieGridSkeletonProps {
  cardCount?: number;
  showFilters?: boolean;
}

export function MovieGridSkeleton({
  cardCount = 8,
  showFilters = true,
}: MovieGridSkeletonProps) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-4 py-8">
      {/* Header & Controls Skeleton */}
      {showFilters && (
        <div className="space-y-6">
          {/* Header Title & Subtitle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-28 rounded-full bg-red-500/20" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-9 w-64 sm:w-80 rounded-xl" />
            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          </div>

          {/* Search bar & filter pills */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Skeleton className="h-11 flex-1 rounded-2xl" />
            <Skeleton className="h-11 w-32 rounded-2xl" />
            <Skeleton className="h-11 w-36 rounded-2xl" />
          </div>

          {/* Genre chips horizontal skeleton */}
          <div className="flex items-center gap-2 overflow-hidden py-1">
            {[72, 80, 64, 90, 84, 76, 88, 68].map((width, idx) => (
              <Skeleton
                key={idx}
                className="h-8 rounded-full flex-shrink-0"
                style={{ width: `${width}px` }}
              />
            ))}
          </div>

          {/* Toolbar count & view sort skeleton */}
          <div className="flex items-center justify-between pt-2 border-b border-border/40 pb-4">
            <Skeleton className="h-4 w-40 rounded" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-28 rounded-xl" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Movie Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: cardCount }).map((_, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden p-3 space-y-3"
          >
            {/* Poster Skeleton with shimmer */}
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-muted/60">
              <Skeleton className="h-full w-full rounded-xl" />
              {/* Badge placeholders */}
              <div className="absolute top-2.5 left-2.5">
                <Skeleton className="h-5 w-14 rounded-full bg-background/80" />
              </div>
              <div className="absolute top-2.5 right-2.5">
                <Skeleton className="h-5 w-12 rounded-full bg-background/80" />
              </div>
            </div>

            {/* Movie Info Skeletons */}
            <div className="space-y-2 pt-1 flex-1 flex flex-col justify-between">
              <div>
                <Skeleton className="h-5 w-4/5 rounded-md mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-12 rounded" />
                  <span className="text-muted-foreground text-xs">•</span>
                  <Skeleton className="h-3.5 w-14 rounded" />
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-2 pt-8">
        <Skeleton className="h-9 w-24 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export default MovieGridSkeleton;
