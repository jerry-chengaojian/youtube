"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    },
  });
}
