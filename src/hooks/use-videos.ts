import {
  useInfiniteQuery,
  type InfiniteData,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { Category, User } from "@prisma/client";

// Types for the API response
export interface Video {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number;
  visibility: "public" | "private";
  createdAt: string;
  updatedAt: string;
  user: User;
  category: Category | null;
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

export function useSaveVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoData: { videoUrl: string; duration: number }) => {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        throw new Error("Failed to save video");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the videos query to refetch the list after a successful save
      queryClient.invalidateQueries({ queryKey: videosQueryKey });
    },
  });
}

export function useVideo(videoId: string) {
  return useQuery<Video>({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${videoId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch video");
      }
      return response.json();
    },
  });
}

export function useUpdateVideo(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title?: string;
      description?: string;
      thumbnailUrl?: string;
      categoryId?: string;
      visibility?: "public" | "private";
    }) => {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update video");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: videosQueryKey });
    },
  });
}

export function useDeleteVideo(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete video");
      }

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: videosQueryKey });
    },
  });
}
