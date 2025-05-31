"use client";

import {
  PlaylistGridCard,
  PlaylistGridCardSkeleton,
} from "../components/playlist-grid-card";

const mockPlaylists = Array.from({ length: 18 }, (_, i) => ({
  id: `playlist-${i}`,
  name: `Playlist ${i + 1}`,
  thumbnailUrl: "/placeholder.svg",
  videoCount: Math.floor(Math.random() * 100) + 1,
}));

export const PlaylistsSection = () => {
  return (
    <>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
        {mockPlaylists.map((playlist) => (
          <PlaylistGridCard key={playlist.id} data={playlist} />
        ))}
      </div>
    </>
  );
};

const PlaylistsSectionSkeleton = () => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
      {Array.from({ length: 18 }).map((_, index) => (
        <PlaylistGridCardSkeleton key={index} />
      ))}
    </div>
  );
};
