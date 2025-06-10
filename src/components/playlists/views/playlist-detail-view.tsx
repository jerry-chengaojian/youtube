"use client";

import {
  PlaylistHeaderSection,
  PlaylistHeaderSectionSkeleton,
} from "../sections/playlist-header-section";
import {
  VideosSection,
  VideosSectionSkeleton,
} from "../sections/videos-section";
import { usePlaylistVideos } from "@/hooks/use-playlists";

interface VideosViewProps {
  playlistId: string;
}

export const PlaylistDetailView = ({ playlistId }: VideosViewProps) => {
  const { data, isLoading, error } = usePlaylistVideos(playlistId);

  if (isLoading) {
    return (
      <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
        <PlaylistHeaderSectionSkeleton />
        <VideosSectionSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>Error loading playlist</div>;
  }

  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection id={data?.id} name={data?.name} />
      <VideosSection videos={data?.videos} playlistId={playlistId} />
    </div>
  );
};
