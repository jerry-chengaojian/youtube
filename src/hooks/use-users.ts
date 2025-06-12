import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@prisma/client";

async function updateAvatar(avatarUrl: string): Promise<User> {
  const response = await fetch("/api/users/avatar", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatarUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to update avatar");
  }

  return response.json();
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["subscriber-count", data.id],
      });
    },
  });
}
