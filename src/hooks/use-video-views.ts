"use client";

import { useQuery } from "@tanstack/react-query";

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
