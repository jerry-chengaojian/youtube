import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { Video } from "./use-videos";

type LikedResponse = {
  items: Video[];
  nextCursor: { id: string; likedAt: string } | null;
};

type PageParam = { id: string; likedAt: string } | undefined;

export const likedQueryKey = ["user-liked"] as const;

async function getLiked(pageParam?: PageParam): Promise<LikedResponse> {
  const params: Record<string, string> = {
    limit: String(DEFAULT_LIMIT),
  };

  if (pageParam) {
    params.cursor = JSON.stringify(pageParam);
  }

  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/users/me/liked?${searchParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch liked videos");
  }

  return response.json();
}

export function useUserLiked() {
  return useInfiniteQuery<
    LikedResponse,
    Error,
    InfiniteData<LikedResponse>,
    typeof likedQueryKey,
    PageParam
  >({
    queryKey: likedQueryKey,
    queryFn: ({ pageParam }) => getLiked(pageParam),
    getNextPageParam: (lastPage: LikedResponse) => lastPage.nextCursor,
    initialPageParam: undefined,
    staleTime: 0,
  });
}
