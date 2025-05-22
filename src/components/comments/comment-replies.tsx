import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";

interface CommentRepliesProps {
  parentId: string;
  videoId: string;
}

export const CommentReplies = ({ parentId, videoId }: CommentRepliesProps) => {
  const isLoading = false;
  const isFetchingNextPage = false;
  const hasNextPage = false;

  const fetchNextPage = () => {
    // 空方法
  };

  // 假数据
  const mockComments = [
    {
      id: "1",
      content: "示例回复评论1",
      createdAt: new Date(),
      user: {
        id: "user1",
        name: "用户1",
        image: null,
      },
    },
    {
      id: "2",
      content: "示例回复评论2",
      createdAt: new Date(),
      user: {
        id: "user2",
        name: "用户2",
        image: null,
      },
    },
  ];

  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          mockComments.map((comment) => (
            <CommentItem key={comment.id} variant="reply" />
          ))}
      </div>
      {hasNextPage && (
        <Button
          variant="tertiary"
          size="sm"
          onClick={fetchNextPage}
          disabled={isFetchingNextPage}
        >
          <CornerDownRightIcon />
          Show more replies
        </Button>
      )}
    </div>
  );
};
