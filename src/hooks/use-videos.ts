import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";

// Types for the API response
type Video = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string;
  duration: number | null;
  visibility: "public" | "private";
  createdAt: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
};

type VideosResponse = {
  items: Video[];
  nextCursor: { id: string; updatedAt: string } | null;
};

type PageParam = { id: string; updatedAt: string } | undefined;

export const videosQueryKey = ["studio-videos"] as const;

async function getVideos(pageParam?: PageParam): Promise<VideosResponse> {
  const params: Record<string, string> = {
    limit: String(DEFAULT_LIMIT),
  };

  if (pageParam) {
    params.cursor = JSON.stringify(pageParam);
  }

  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/videos?${searchParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }

  return response.json();
}

export function useVideos() {
  return useInfiniteQuery<
    VideosResponse,
    Error,
    InfiniteData<VideosResponse>,
    typeof videosQueryKey,
    PageParam
  >({
    queryKey: videosQueryKey,
    queryFn: ({ pageParam }) => getVideos(pageParam),
    getNextPageParam: (lastPage: VideosResponse) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
}
