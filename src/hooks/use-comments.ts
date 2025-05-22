"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Comment, User } from "@prisma/client";

export const commentsQueryKey = (videoId: string) =>
  ["comments", videoId] as const;

export interface CommentWithRelations extends Comment {
  user: User;
  replies: Comment[];
}

async function getComments(videoId: string): Promise<CommentWithRelations[]> {
  const response = await fetch(`/api/videos/${videoId}/comments`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
}

export const commentRepliesQueryKey = (videoId: string, parentId: string) =>
  ["comment-replies", videoId, parentId] as const;

async function getCommentReplies(
  videoId: string,
  parentId: string
): Promise<CommentWithRelations[]> {
  const response = await fetch(
    `/api/videos/${videoId}/comments/${parentId}/replies`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comment replies");
  }
  return response.json();
}

export function useCommentReplies(videoId: string, parentId: string) {
  return useQuery<CommentWithRelations[]>({
    queryKey: commentRepliesQueryKey(videoId, parentId),
    queryFn: () => getCommentReplies(videoId, parentId),
  });
}

export function useComments(videoId: string) {
  return useQuery<CommentWithRelations[]>({
    queryKey: commentsQueryKey(videoId),
    queryFn: () => getComments(videoId),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: {
      videoId: string;
      parentId?: string;
      value: string;
    }) => {
      const response = await fetch(`/api/videos/${commentData.videoId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(variables.videoId) });
    },
  });
}