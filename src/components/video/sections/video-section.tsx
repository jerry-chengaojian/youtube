"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { VideoTopRowSkeleton } from "../components/video-top-row";

interface VideoSectionProps {
  videoId: string;
}

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

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  return <VideoSectionSkeleton />;

  // return (
  //   <>
  //     <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
  //       <VideoPlayer
  //         autoPlay
  //         onPlay={handlePlay}
  //         playbackId={video.muxPlaybackId}
  //         thumbnailUrl={video.thumbnailUrl}
  //       />
  //     </div>
  //     <VideoBanner status={video.muxStatus} />
  //     <VideoTopRow video={video} />
  //   </>
  // )
};
