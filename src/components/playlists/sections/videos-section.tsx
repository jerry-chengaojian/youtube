"use client";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/components/video/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/components/video/components/video-row-card";
import { Video } from "@/hooks/use-videos";

interface VideosSectionProps {
  videos?: Video[];
}

export const VideosSection = ({ videos }: VideosSectionProps) => {
  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos?.map((video) => (
          <VideoGridCard key={video.id} data={video} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos?.map((video) => (
          <VideoRowCard key={video.id} data={video} size="compact" />
        ))}
      </div>
    </>
  );
};

export const VideosSectionSkeleton = () => {
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
