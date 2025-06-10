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
import { useToggleVideoInPlaylist } from "@/hooks/use-playlists";
import { toast } from "sonner";

interface VideosSectionProps {
  videos?: Video[];
  playlistId: string;
}

export const VideosSection = ({ videos, playlistId }: VideosSectionProps) => {
  const { mutate: toggleVideo } = useToggleVideoInPlaylist();

  const handleRemove = (videoId: string, playlistId: string) => {
    toggleVideo(
      { videoId, playlistId, action: "remove" },
      {
        onSuccess: () => {
          toast.success("Video removed from playlist");
        },
        onError: () => {
          toast.error("Failed to remove video from playlist");
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos?.map((video) => (
          <VideoGridCard
            key={video.id}
            data={video}
            onRemove={() => handleRemove(video.id, playlistId)}
          />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos?.map((video) => (
          <VideoRowCard
            key={video.id}
            data={video}
            size="compact"
            onRemove={() => handleRemove(video.id, playlistId)}
          />
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
