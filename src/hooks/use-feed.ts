import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { Video } from "./use-videos";

export const videosQueryKey = (categoryId?: string, search?: string) =>
  ["videos", categoryId, search] as const;

type VideosResponse = {
  items: Video[];
  nextCursor: { id: string; updatedAt: string } | null;
};

type PageParam = { id: string; updatedAt: string } | undefined;

async function getVideos(
  pageParam?: PageParam,
  categoryId?: string,
  search?: string
): Promise<VideosResponse> {
  const params: Record<string, string> = {
    limit: String(DEFAULT_LIMIT),
  };

  if (pageParam) {
    params.cursor = JSON.stringify(pageParam);
  }
  if (categoryId) {
    params.categoryId = categoryId;
  }

  if (search) {
    params.search = search;
  }

  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/feed?${searchParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }

  return response.json();
}

export const subscriptionsQueryKey = () => ["subscriptions"] as const;

async function getSubscriptions(
  pageParam?: PageParam
): Promise<VideosResponse> {
  const params: Record<string, string> = {
    limit: String(DEFAULT_LIMIT),
  };

  if (pageParam) {
    params.cursor = JSON.stringify(pageParam);
  }

  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/feed/subscriptions?${searchParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return response.json();
}

export function useSubscriptions() {
  return useInfiniteQuery<
    VideosResponse,
    Error,
    InfiniteData<VideosResponse>,
    ReturnType<typeof subscriptionsQueryKey>,
    PageParam
  >({
    queryKey: subscriptionsQueryKey(),
    queryFn: ({ pageParam }) => getSubscriptions(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
}

export function useFeed(categoryId?: string, search?: string) {
  return useInfiniteQuery<
    VideosResponse,
    Error,
    InfiniteData<VideosResponse>,
    ReturnType<typeof videosQueryKey>,
    PageParam
  >({
    queryKey: videosQueryKey(categoryId, search),
    queryFn: ({ pageParam }) => getVideos(pageParam, categoryId, search),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
}

export const trendingQueryKey = () => ["trending"] as const;

async function getTrending(): Promise<Video[]> {
  const response = await fetch("/api/feed/trending");

  if (!response.ok) {
    throw new Error("Failed to fetch trending videos");
  }

  return response.json();
}

export function useTrending() {
  return useQuery<Video[], Error>({
    queryKey: trendingQueryKey(),
    queryFn: getTrending,
  });
}
