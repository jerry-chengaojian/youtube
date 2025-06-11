"use client";

import { VideoGridCardSkeleton } from "@/components/video/components/video-grid-card";

interface VideosSectionProps {
  userId: string;
}

export const VideosSection = (props: VideosSectionProps) => {
  return <div>video section</div>;
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
