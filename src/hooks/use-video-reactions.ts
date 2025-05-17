"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface VideoReactionsResponse {
  likes: number;
  dislikes: number;
  viewerReaction?: "like" | "dislike" | null;
}

export function useVideoReactions(videoId: string) {
  return useQuery<VideoReactionsResponse>({
    queryKey: ["video-reactions", videoId],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${videoId}/reactions`);
      if (!response.ok) {
        throw new Error("Failed to fetch video reactions");
      }
      return response.json();
    },
  });
}

export function useLikeVideo(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like video");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-reactions", videoId] });
    },
  });
}

export function useDislikeVideo(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/videos/${videoId}/dislike`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to dislike video");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-reactions", videoId] });
    },
  });
}
