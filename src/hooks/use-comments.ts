"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Comment, User, ReactionType } from "@prisma/client";
import { DEFAULT_LIMIT } from "../constants";

export const commentsQueryKey = (videoId: string) =>
  ["comments", videoId] as const;

export interface CommentWithRelations extends Comment {
  user: User;
  replyCount: number;
  likes: number;
  dislikes: number;
  viewerReaction: ReactionType | null;
}

export interface CommentsResponse {
  totalComments: number;
  items: CommentWithRelations[];
  nextCursor: { id: string; createdAt: string } | null;
}

type PageParam = { id: string; createdAt: string } | undefined;

async function getComments(
  videoId: string,
  pageParam?: PageParam
): Promise<CommentsResponse> {
  const params: Record<string, string> = {
    limit: DEFAULT_LIMIT.toString(),
  };

  if (pageParam) {
    params.cursor = JSON.stringify(pageParam);
  }

  const searchParams = new URLSearchParams(params);
  const response = await fetch(
    `/api/videos/${videoId}/comments?${searchParams}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
}

export const commentRepliesQueryKey = (videoId: string, parentId: string) =>
  ["comment-replies", videoId, parentId] as const;

async function getCommentReplies(
  videoId: string,
  parentId: string
): Promise<CommentWithRelations[]> {
  const response = await fetch(
    `/api/videos/${videoId}/comments/${parentId}/replies`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comment replies");
  }
  return response.json();
}

export function useCommentReplies(videoId: string, parentId: string) {
  return useQuery<CommentWithRelations[]>({
    queryKey: commentRepliesQueryKey(videoId, parentId),
    queryFn: () => getCommentReplies(videoId, parentId),
  });
}

export function useComments(videoId: string) {
  return useInfiniteQuery<
    CommentsResponse,
    Error,
    InfiniteData<CommentsResponse>,
    ReturnType<typeof commentsQueryKey>,
    PageParam
  >({
    queryKey: commentsQueryKey(videoId),
    queryFn: ({ pageParam }) => getComments(videoId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
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
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentRepliesQueryKey(
            variables.videoId,
            variables.parentId
          ),
        });
      }
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: {
      videoId: string;
      commentId: string;
      parentId?: string;
    }) => {
      const response = await fetch(`/api/comments/${commentData.commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentsQueryKey(variables.videoId),
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentRepliesQueryKey(
            variables.videoId,
            variables.parentId
          ),
        });
      }
    },
  });
}