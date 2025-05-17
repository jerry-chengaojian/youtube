import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoReactionsProps {
  videoId: string;
}

export const VideoReactions = ({ videoId }: VideoReactionsProps) => {
  const likes = 123;
  const dislikes = 45;
  const viewerReaction = "like";

  return (
    <div className="flex items-center">
      <Button
        onClick={() => {}}
        disabled={false}
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={() => {}}
        disabled={false}
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon className={cn("size-5")} />
        {dislikes}
      </Button>
    </div>
  );
};
