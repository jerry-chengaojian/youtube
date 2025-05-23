"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentRepliesQueryKey, commentsQueryKey } from "./use-comments";

export function useLikeComment(
  videoId: string,
  commentId: string,
  parentId: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/comments/${commentId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "like" }),
      });

      if (!response.ok) {
        throw new Error("Failed to like comment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentsQueryKey(videoId),
      });
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: commentRepliesQueryKey(videoId, parentId),
        });
      }
    },
  });
}

export function useDislikeComment(
  videoId: string,
  commentId: string,
  parentId: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/comments/${commentId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "dislike" }),
      });

      if (!response.ok) {
        throw new Error("Failed to dislike comment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentsQueryKey(videoId),
      });
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: commentRepliesQueryKey(videoId, parentId),
        });
      }
    },
  });
}
