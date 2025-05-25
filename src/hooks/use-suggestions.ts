import { useQuery } from "@tanstack/react-query";
import { Video } from "./use-videos";

export const suggestionsQueryKey = ["suggestions"] as const;

async function getSuggestions(videoId: string): Promise<Video[]> {
  const response = await fetch(`/api/videos/${videoId}/suggestions`);
  if (!response.ok) {
    throw new Error("Failed to fetch suggestions");
  }
  return response.json();
}

export function useSuggestions(videoId: string) {
  return useQuery<Video[]>({
    queryKey: [...suggestionsQueryKey, videoId],
    queryFn: () => getSuggestions(videoId),
  });
}
