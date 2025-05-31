import { toast } from "sonner";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useVideoPlaylists } from "@/hooks/use-playlists";
import { useToggleVideoInPlaylist } from "@/hooks/use-playlists";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export const PlaylistAddModal = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModalProps) => {
  const { data: playlists, isLoading } = useVideoPlaylists(videoId);
  const { mutate: toggleVideoInPlaylist, isPending } =
    useToggleVideoInPlaylist();

  const handleTogglePlaylist = (playlistId: string, hasVideo: boolean) => {
    toggleVideoInPlaylist(
      {
        videoId,
        playlistId,
        action: hasVideo ? "remove" : "add",
      },
      {
        onSuccess: () => {
          toast.success(
            hasVideo ? "Removed from playlist" : "Added to playlist"
          );
        },
        onError: () => {
          toast.error("Failed to update playlist");
        },
      }
    );
  };

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          playlists?.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <span className="text-sm">{playlist.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleTogglePlaylist(playlist.id, playlist.hasVideo)
                }
                disabled={isPending}
              >
                {playlist.hasVideo ? (
                  <SquareCheckIcon className="size-5" />
                ) : (
                  <SquareIcon className="size-5" />
                )}
              </Button>
            </div>
          ))
        )}
      </div>
    </ResponsiveModal>
  );
};
