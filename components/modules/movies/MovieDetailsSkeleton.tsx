import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Top Navigation Bar Skeleton */}
      <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
        <Skeleton className="h-5 w-44 rounded-md bg-zinc-800/60" />
        <Skeleton className="h-8 w-20 rounded-lg bg-zinc-800/60" />
      </div>

      {/* Hero Cinema Showcase Skeleton */}
      <div className="relative w-full overflow-hidden bg-zinc-950 border-y border-white/10 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Movie Poster Skeleton */}
            <div className="relative w-56 sm:w-64 aspect-[2/3] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/80 mx-auto md:mx-0">
              <Skeleton className="h-full w-full bg-zinc-800/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-zinc-700/40 animate-pulse flex items-center justify-center" />
              </div>
            </div>

            {/* Movie Metadata Skeleton */}
            <div className="flex-1 space-y-5 text-center md:text-left w-full">
              {/* Badges row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <Skeleton className="h-6 w-24 rounded-full bg-amber-500/20" />
                <Skeleton className="h-6 w-20 rounded-full bg-emerald-500/20" />
                <Skeleton className="h-6 w-16 rounded-full bg-zinc-800/60" />
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-800/60" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-10 sm:h-12 w-3/4 max-w-xl mx-auto md:mx-0 rounded-xl bg-zinc-800/60" />
                <Skeleton className="h-4 w-40 mx-auto md:mx-0 rounded bg-zinc-800/40" />
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {[60, 72, 64].map((width, idx) => (
                  <Skeleton
                    key={idx}
                    className="h-6 rounded-full bg-zinc-800/60"
                    style={{ width: `${width}px` }}
                  />
                ))}
              </div>

              {/* Overview Paragraph Skeleton */}
              <div className="space-y-2 pt-2 max-w-2xl mx-auto md:mx-0">
                <Skeleton className="h-4 w-full rounded bg-zinc-800/40" />
                <Skeleton className="h-4 w-11/12 rounded bg-zinc-800/40" />
                <Skeleton className="h-4 w-4/5 rounded bg-zinc-800/40" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                <Skeleton className="h-11 w-40 rounded-xl bg-red-600/30" />
                <Skeleton className="h-11 w-36 rounded-xl bg-zinc-800/60" />
                <Skeleton className="h-11 w-11 rounded-xl bg-zinc-800/60" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Details / Reviews Section Skeleton */}
      <div className="container mx-auto px-4 max-w-7xl pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Reviews Skeleton) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-44 rounded-lg bg-zinc-800/60" />
            <Skeleton className="h-5 w-24 rounded bg-zinc-800/40" />
          </div>

          {/* Write review card skeleton */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full bg-zinc-800" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-28 rounded bg-zinc-800" />
                <Skeleton className="h-3 w-16 rounded bg-zinc-800" />
              </div>
            </div>
            <Skeleton className="h-24 w-full rounded-xl bg-zinc-800/40" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 rounded-full bg-zinc-800/40" />
              <Skeleton className="h-9 w-28 rounded-xl bg-red-600/20" />
            </div>
          </div>

          {/* Reviews list skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-9 w-9 rounded-full bg-zinc-800" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-24 rounded bg-zinc-800" />
                    <Skeleton className="h-3 w-16 rounded bg-zinc-800" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full bg-amber-500/20" />
              </div>
              <Skeleton className="h-4 w-full rounded bg-zinc-800/40" />
              <Skeleton className="h-4 w-3/4 rounded bg-zinc-800/40" />
            </div>
          ))}
        </div>

        {/* Sidebar Info Skeleton */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 space-y-4">
            <Skeleton className="h-5 w-32 rounded bg-zinc-800/60" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl bg-zinc-800/40" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsSkeleton;
