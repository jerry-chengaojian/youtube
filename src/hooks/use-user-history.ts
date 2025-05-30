import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { Video } from "./use-videos";

type HistoryResponse = {
  items: Video[];
  nextCursor: { id: string; viewedAt: string } | null;
};

type PageParam = { id: string; viewedAt: string } | undefined;

export const historyQueryKey = ["user-history"] as const;

async function getHistory(pageParam?: PageParam): Promise<HistoryResponse> {
  const params: Record<string, string> = {
    limit: String(DEFAULT_LIMIT),
  };

  if (pageParam) {
    params.cursor = JSON.stringify(pageParam);
  }

  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/users/me/history?${searchParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return response.json();
}

export function useUserHistory() {
  return useInfiniteQuery<
    HistoryResponse,
    Error,
    InfiniteData<HistoryResponse>,
    typeof historyQueryKey,
    PageParam
  >({
    queryKey: historyQueryKey,
    queryFn: ({ pageParam }) => getHistory(pageParam),
    getNextPageParam: (lastPage: HistoryResponse) => lastPage.nextCursor,
    initialPageParam: undefined,
    staleTime: 0,
  });
}
