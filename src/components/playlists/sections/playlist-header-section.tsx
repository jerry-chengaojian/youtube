"use client";

import { Suspense } from "react";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

export const PlaylistHeaderSection = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const emptyFunction = () => {};
  const playlist = { name: "Playlist Name" };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-xs text-muted-foreground">
          Videos from the playlist
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={emptyFunction}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};

export const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
};
