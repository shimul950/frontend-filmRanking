"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  genre: string;
  rating: number;
  releaseYear: number;
}

export default function HeroSlider({
  banners,
}: {
  banners: Banner[];
}) {
  return (
    <section className="relative h-[85vh] w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-[85vh] w-full">

              {/* background */}
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority
                className="object-cover"
              />

              {/* dark overlay */}
              <div className="absolute inset-0 bg-black/70" />

              {/* gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

              {/* content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6">
                  <div className="max-w-2xl space-y-6">

                    <span className="rounded-full bg-red-600 px-4 py-1 text-sm text-white">
                      🔥 Trending Now
                    </span>

                    <h1 className="text-5xl font-black text-white md:text-7xl">
                      {banner.title}
                    </h1>

                    <p className="text-lg text-zinc-300">
                      {banner.description}
                    </p>

                    <div className="flex gap-4 text-zinc-300">
                      <span>⭐ {banner.rating}</span>
                      <span>🎬 {banner.genre}</span>
                      <span>📅 {banner.releaseYear}</span>
                    </div>

                    <div className="flex gap-4">
                      <Button className="bg-red-600 hover:bg-red-700">
                        Watch Trailer
                      </Button>

                      <Button
                        variant="outline"
                        className="border-white/20 bg-white/10 text-white"
                      >
                        Add Watchlist
                      </Button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}