"use client";

import { CommentForm } from "@/components/comments/comment-form";
import { CommentItem } from "@/components/comments/comment-item";
import { useComments } from "@/hooks/use-comments";
import { Loader2Icon } from "lucide-react";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(videoId);

  if (isLoading) {
    return <CommentsSectionSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-bold">Error loading comments</h1>
        </div>
      </div>
    );
  }

  const comments = data?.pages.flatMap((page) => page.items) ?? [];
  const totalComments = data?.pages[0]?.totalComments ?? 0;

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">{totalComments} Comments</h1>
        <CommentForm videoId={videoId} />
        <div className="flex flex-col gap-4 mt-2">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          {isFetchingNextPage && <CommentsSectionSkeleton />}
        </div>
        <InfiniteScroll
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
};

export const CommentsSectionSkeleton = () => {
  return (
    <div className="mt-6 flex justify-center items-center">
      <Loader2Icon className="text-muted-foreground size-7 animate-spin" />
    </div>
  );
};
