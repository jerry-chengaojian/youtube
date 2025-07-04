"use client";

import { User } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SubscriberCountResponse {
  count: number;
  isSubscribed: boolean;
  userName: string;
  videoCount: number;
  avatarUrl?: string;
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

type Subscription = {
  creatorId: string;
  viewerId: string;
  creator: User & { subscriberCount: number };
};

export function useSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const response = await fetch("/api/subscriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }
      return response.json();
    },
  });
}

export function useToggleSubscription(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isSubscribed: boolean) => {
      const response = await fetch(`/api/users/${userId}/subscriptions`, {
        method: isSubscribed ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error(
          isSubscribed ? "Failed to unsubscribe" : "Failed to subscribe"
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriber-count", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
    },
  });
}
