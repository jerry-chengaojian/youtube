"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Comment } from "@prisma/client";

export const commentsQueryKey = (videoId: string) => ["comments", videoId] as const;

async function getComments(videoId: string): Promise<Comment[]> {
  const response = await fetch(`/api/videos/${videoId}/comments`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
}

export function useComments(videoId: string) {
  return useQuery<Comment[]>({
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