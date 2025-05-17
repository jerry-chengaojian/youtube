import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useVideoReactions,
  useLikeVideo,
  useDislikeVideo,
} from "@/hooks/use-video-reactions";

interface VideoReactionsProps {
  videoId: string;
}

export const VideoReactions = ({ videoId }: VideoReactionsProps) => {
  const { data } = useVideoReactions(videoId);
  const { mutate: likeVideo } = useLikeVideo(videoId);
  const { mutate: dislikeVideo } = useDislikeVideo(videoId);

  const handleLike = () => {
    likeVideo();
  };

  const handleDislike = () => {
    dislikeVideo();
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={handleLike}
        disabled={!data}
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn(
            "size-5",
            data?.viewerReaction === "like" && "fill-black"
          )}
        />
        {data?.likes || 0}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={handleDislike}
        disabled={!data}
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon
          className={cn(
            "size-5",
            data?.viewerReaction === "dislike" && "fill-black"
          )}
        />
        {data?.dislikes || 0}
      </Button>
    </div>
  );
};
