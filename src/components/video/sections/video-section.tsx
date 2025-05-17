"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { VideoTopRow, VideoTopRowSkeleton } from "../components/video-top-row";
import { useVideo } from "@/hooks/use-videos";
import { useCreateVideoView } from "@/hooks/use-video-views";

interface VideoSectionProps {
  videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  const { data: video, isLoading, error } = useVideo(videoId);
  const { mutate: createVideoView } = useCreateVideoView(videoId);

  if (isLoading) return <VideoSectionSkeleton />;
  if (error || !video) return <div>Error loading video</div>;

  return (
    <>
      <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
        {
          <video
            src={video.videoUrl}
            className="w-full h-full object-cover"
            controls
            poster={video.thumbnailUrl || undefined}
            preload="metadata"
            onPlay={() => createVideoView()}
          />
        }
      </div>
      <VideoTopRow video={video} />
    </>
  );
};

export const VideoPlayerSkeleton = () => {
  return <Skeleton className="aspect-video rounded-xl" />;
};

export const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
};
