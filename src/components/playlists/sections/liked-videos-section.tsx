"use client";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/components/video/components/video-grid-card";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { useUserLiked } from "@/hooks/use-user-liked";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/components/video/components/video-row-card";

export const LikedVideosSection = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useUserLiked();

  if (isLoading) {
    return <LikedVideosSectionSkeleton />;
  }

  if (error) {
    return <div className="text-center py-10">Error loading liked videos</div>;
  }

  const videos = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.map((video) => (
          <VideoGridCard key={video.id} data={video} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos.map((video) => (
          <VideoRowCard key={video.id} data={video} size="compact" />
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

const LikedVideosSectionSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
      </div>
    </div>
  );
};
