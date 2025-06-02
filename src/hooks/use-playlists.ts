"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Video } from "./use-videos";

export const playlistsQueryKey = ["playlists"] as const;

export interface Playlist {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  videoCount: number;
}

export function usePlaylists() {
  return useQuery<Playlist[]>({
    queryKey: playlistsQueryKey,
    queryFn: async () => {
      const response = await fetch(`/api/playlists`);
      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }
      return response.json();
    },
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlistData: {
      name: string;
      description?: string;
    }) => {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlistData),
      });

      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistsQueryKey });
      queryClient.invalidateQueries({
        queryKey: ["videoPlaylists"],
        exact: false,
      });
    },
  });
}

export interface VideoPlaylistStatus {
  id: string;
  name: string;
  hasVideo: boolean;
}

export interface VideoPlaylistDetails extends Playlist {
  videos: Video[];
}

export function useVideoPlaylists(videoId: string, open: boolean) {
  return useQuery<VideoPlaylistStatus[]>({
    queryKey: ["videoPlaylists", videoId],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${videoId}/playlist`);
      if (!response.ok) {
        throw new Error("Failed to fetch video playlists status");
      }
      return response.json();
    },
    enabled: !!videoId && open,
  });
}

export function useToggleVideoInPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      playlistId,
      action,
    }: {
      videoId: string;
      playlistId: string;
      action: "add" | "remove";
    }) => {
      const response = await fetch(`/api/videos/${videoId}/playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle video in playlist");
      }

      return response.json();
    },
    onSuccess: (_, { videoId, playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ["videoPlaylists", videoId] });
      queryClient.invalidateQueries({ queryKey: playlistsQueryKey });
      queryClient.invalidateQueries({
        queryKey: playlistVideosQueryKey(playlistId),
      });
    },
  });
}

export const playlistVideosQueryKey = (playlistId: string) =>
  ["playlistVideos", playlistId] as const;

export function usePlaylistVideos(playlistId: string) {
  return useQuery<VideoPlaylistDetails>({
    queryKey: playlistVideosQueryKey(playlistId),
    queryFn: async () => {
      const response = await fetch(`/api/playlists/${playlistId}/videos`);
      if (!response.ok) {
        throw new Error("Failed to fetch playlist videos");
      }
      return response.json();
    },
    enabled: !!playlistId,
  });
}