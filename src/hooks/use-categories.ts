import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";

export const categoriesQueryKey = ["categories"] as const;

async function getCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: categoriesQueryKey,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });
}
