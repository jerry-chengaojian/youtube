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
  playlistId: string;
}

const mockVideos: Video[] = Array.from({ length: 6 }).map((_, index) => ({
  user: {
    id: "mock-user",
    name: "Mock User",
    email: "mock@example.com",
    password: "mock-password", // Add the missing 'password' property
    emailVerified: null,
    image: null,
    createdAt: new Date(), // Convert to Date type if required by the 'Video' type
    updatedAt: new Date(), // Convert to Date type if required by the 'Video' type
  },
  id: `mock-video-${index}`,
  title: `Mock Video ${index + 1}`,
  description: `This is a mock video description ${index + 1}`,
  videoUrl: "",
  thumbnailUrl: null,
  duration: 120 + index * 30,
  visibility: "public",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: null,
  categoryId: null,
  videoViews: 1000 + index * 500,
  comments: 10 + index,
  videoReactions: 50 + index * 10,
}));

export const VideosSection = ({ playlistId }: VideosSectionProps) => {
  const emptyFunction = () => {};

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {mockVideos.map((video) => (
          <VideoGridCard key={video.id} data={video} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {mockVideos.map((video) => (
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
