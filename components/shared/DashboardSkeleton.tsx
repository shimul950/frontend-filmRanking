import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 rounded-xl" />
          <Skeleton className="h-4 w-80 max-w-full rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl bg-red-600/20" />
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border/70 bg-card/60 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg bg-red-500/10" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        ))}
      </div>

      {/* Main Chart / Analytics Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-border/70 bg-card/60 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-4">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-2.5 w-16 rounded" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-4">
        <div className="flex items-center justify-between pb-2">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
