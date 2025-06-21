"use client";

import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/components/video/components/video-grid-card";
import { useFeed } from "@/hooks/use-feed";

interface VideosSectionProps {
  userId: string;
}

export const VideosSection = ({ userId }: VideosSectionProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useFeed(undefined, undefined, userId);

  if (isLoading) {
    return <VideosSectionSkeleton />;
  }

  if (error) {
    return <div className="text-center py-10">Error loading videos</div>;
  }

  const videos = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {videos.map((video) => (
          <VideoGridCard key={video.id} data={video} />
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export const VideosSectionSkeleton = () => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};
