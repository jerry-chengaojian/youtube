"use client";

import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";
import { FilterCarousel } from "@/components/ui/filter-carousel";

interface CategoriesSectionProps {
  categoryId?: string;
}

export function CategoriesSection({ categoryId }: CategoriesSectionProps) {
  const router = useRouter();
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-sm text-muted-foreground">
        Failed to load categories. Please try again later.
      </div>
    );
  }

  const data =
    categories?.map((category) => ({
      value: category.id,
      label: category.name,
    })) ?? [];

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  };

  return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />;
}
