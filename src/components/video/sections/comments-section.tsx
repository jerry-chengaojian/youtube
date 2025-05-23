"use client";

import { CommentForm } from "@/components/comments/comment-form";
import { CommentItem } from "@/components/comments/comment-item";
import { useComments } from "@/hooks/use-comments";
import { Loader2Icon } from "lucide-react";

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  const { data, isLoading, error } = useComments(videoId);

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

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">
          {data?.totalComments || 0} Comments
        </h1>
        <CommentForm videoId={videoId} />
        <div className="flex flex-col gap-4 mt-2">
          {data?.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
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
