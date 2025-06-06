"use client";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/components/video/components/video-grid-card";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { useSubscriptions } from "@/hooks/use-feed";

export const SubscribedVideosSection = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSubscriptions();

  if (isLoading) {
    return <SubscribedVideosSectionSkeleton />;
  }

  if (error) {
    return <div className="text-center py-10">Error loading videos</div>;
  }

  const videos = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
        {videos.map((video) => (
          <VideoGridCard key={video.id} data={video} />
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

const SubscribedVideosSectionSkeleton = () => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};
