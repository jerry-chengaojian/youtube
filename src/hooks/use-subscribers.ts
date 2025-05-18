"use client";

import { useQuery } from "@tanstack/react-query";

interface SubscriberCountResponse {
  count: number;
}

export function useSubscriberCount(userId: string) {
  return useQuery<SubscriberCountResponse>({
    queryKey: ["subscriber-count", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/subscribers/count`);
      if (!response.ok) {
        throw new Error("Failed to fetch subscriber count");
      }
      return response.json();
    },
  });
}
