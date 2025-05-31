"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Playlist } from "@prisma/client";

export const playlistsQueryKey = (userId: string) =>
  ["playlists", userId] as const;

export interface PlaylistWithVideos extends Playlist {
  videoCount: number;
}

export function usePlaylists(userId: string) {
  return useQuery<PlaylistWithVideos[]>({
    queryKey: playlistsQueryKey(userId),
    queryFn: async () => {
      const response = await fetch(`/api/playlists?userId=${userId}`);
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
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}
