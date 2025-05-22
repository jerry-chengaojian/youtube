"use client";

import { CommentForm } from "@/components/comments/comment-form";
import { CommentItem } from "@/components/comments/comment-item";

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  const mockComments = [
    {
      id: "1",
      userId: "user-1",
      user: {
        clerkId: "clerk-1",
        name: "John Doe",
        imageUrl: "/avatar.jpg",
      },
      value: "This video is amazing! Very clear explanation!",
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      videoId: videoId,
      likeCount: 42,
      dislikeCount: 2,
      replyCount: 3,
      viewerReaction: "like",
    },
    {
      id: "2",
      userId: "user-2",
      user: {
        clerkId: "clerk-2",
        name: "Jane Smith",
        imageUrl: "/avatar2.jpg",
      },
      value: "In which version was this feature added?",
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      videoId: videoId,
      likeCount: 15,
      dislikeCount: 0,
      replyCount: 1,
      viewerReaction: null,
    },
    {
      id: "3",
      userId: "user-3",
      user: {
        clerkId: "clerk-3",
        name: "Mike Johnson",
        imageUrl: "/avatar3.jpg",
      },
      value: "Thanks for sharing, learned a lot!",
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      videoId: videoId,
      likeCount: 28,
      dislikeCount: 1,
      replyCount: 0,
      viewerReaction: null,
    },
  ];
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">{0} Comments</h1>
        <CommentForm videoId={videoId} />
        <div className="flex flex-col  gap-4 mt-2">
          {mockComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={{
                ...comment,
                viewerReaction: comment.viewerReaction as
                  | "like"
                  | "dislike"
                  | null,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
