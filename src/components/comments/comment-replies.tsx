import { Loader2Icon } from "lucide-react";
import { CommentItem } from "./comment-item";
import { useCommentReplies } from "@/hooks/use-comments";

interface CommentRepliesProps {
  videoId: string;
  parentId: string;
}

export const CommentReplies = ({ videoId, parentId }: CommentRepliesProps) => {
  const { data: replies, isLoading } = useCommentReplies(videoId, parentId);

  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          replies?.map((comment) => (
            <CommentItem
              key={comment.id}
              variant="reply"
              comment={{
                ...comment,
                likeCount: 0,
                dislikeCount: 0,
                replyCount: comment.replies?.length || 0,
                viewerReaction: null,
              }}
            />
          ))}
      </div>
    </div>
  );
};
