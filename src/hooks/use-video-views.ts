"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface VideoViewsResponse {
  viewCount: number;
}

export function useVideoViews(videoId: string) {
  return useQuery<VideoViewsResponse>({
    queryKey: ["video-views", videoId],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${videoId}/views`);
      if (!response.ok) {
        throw new Error("Failed to fetch video views");
      }
      return response.json();
    },
  });
}

export function useCreateVideoView(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/videos/${videoId}/views`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to record video view");
      }

      return response.json();
    },
    onSuccess: () => {
      // 成功后刷新视频观看数
      queryClient.invalidateQueries({ queryKey: ["video-views", videoId] });
    },
  });
}
