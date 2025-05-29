"use client";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/components/video/components/video-grid-card";
import { useTrending } from "@/hooks/use-feed";

export const TrendingVideosSection = () => {
  const { data: videos, isLoading, error } = useTrending();

  if (isLoading) return <TrendingVideosSkeleton />;
  if (error) return <p>Error: {error.message}</p>;
  if (!videos?.length) return <p>No trending videos found</p>;

  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
      {videos.map((video) => (
        <VideoGridCard key={video.id} data={video} />
      ))}
    </div>
  );
};

const TrendingVideosSkeleton = () => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};
