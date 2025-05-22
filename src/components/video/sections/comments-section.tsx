"use client";

import { CommentForm } from "@/components/comments/comment-form";
import { CommentItem } from "@/components/comments/comment-item";
import { useComments } from "@/hooks/use-comments";

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  const { data: comments, isLoading, error } = useComments(videoId);

  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-bold">Loading comments...</h1>
        </div>
      </div>
    );
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
        <h1 className="text-xl font-bold">{comments?.length || 0} Comments</h1>
        <CommentForm videoId={videoId} />
        <div className="flex flex-col gap-4 mt-2">
          {comments?.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={{
                id: comment.id,
                userId: comment.userId,
                user: {
                  clerkId: comment.user.id,
                  name: comment.user.name || "Anonymous",
                  imageUrl: "/avatar.jpg",
                },
                value: comment.value,
                createdAt: new Date(comment.createdAt),
                videoId: comment.videoId,
                likeCount: 0,
                dislikeCount: 0,
                replyCount: comment.replies?.length || 0,
                viewerReaction: null,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
