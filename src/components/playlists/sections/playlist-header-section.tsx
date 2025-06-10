"use client";

import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeletePlaylist } from "@/hooks/use-playlists";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PlaylistHeaderSectionProps {
  id?: string;
  name?: string;
}

export const PlaylistHeaderSection = ({
  id,
  name,
}: PlaylistHeaderSectionProps) => {
  const router = useRouter();
  const { mutate: deletePlaylist, isPending } = useDeletePlaylist();

  const handleDelete = () => {
    if (!id) return;

    deletePlaylist(id, {
      onSuccess: () => {
        toast.success("Playlist deleted successfully");
        router.push("/playlists");
      },
      onError: () => {
        toast.error("Failed to delete playlist");
      },
    });
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-xs text-muted-foreground">
          Videos from the playlist
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={handleDelete}
        disabled={isPending}
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
