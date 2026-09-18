"use client";

import React from "react";
import { Film, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilmPageLoaderProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  className?: string;
}

export function FilmPageLoader({
  text = "Loading cinema experience...",
  subtext = "Preparing your movies, ratings & recommendations",
  fullScreen = true,
  className,
}: FilmPageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center relative overflow-hidden",
        fullScreen
          ? "min-h-[70vh] w-full px-4 py-16"
          : "w-full py-12 px-4",
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 dark:bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main glass card container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full p-8 rounded-3xl border border-white/10 dark:border-white/5 bg-background/80 dark:bg-neutral-950/60 backdrop-blur-xl shadow-2xl shadow-red-950/20 text-center">
        {/* Animated Reel & Rings Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Concentric outer pulsing ring */}
          <div className="absolute -inset-3 rounded-full border border-red-500/20 animate-ping [animation-duration:3s]" />
          <div className="absolute -inset-1.5 rounded-full border border-red-500/40 animate-pulse" />

          {/* Central glowing orb */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 text-white shadow-lg shadow-red-600/30">
            {/* Spinning inner film icon */}
            <Film className="w-10 h-10 animate-spin [animation-duration:6s]" />

            {/* Sparkle badge */}
            <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-amber-500 text-neutral-950 shadow-md animate-bounce [animation-duration:2s]">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Brand Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold tracking-wider uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          FilmRank Cinema
        </div>

        {/* Primary Message */}
        <h3 className="text-lg font-bold text-foreground tracking-tight mb-1.5">
          {text}
        </h3>

        {/* Subtext */}
        {subtext && (
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px] mb-5">
            {subtext}
          </p>
        )}

        {/* Progress bar shimmer */}
        <div className="w-full max-w-[200px] h-1.5 bg-muted/60 rounded-full overflow-hidden relative">
          <div className="h-full w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default FilmPageLoader;
