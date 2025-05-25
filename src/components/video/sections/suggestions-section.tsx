"use client";

import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "../components/video-row-card";
import { useSuggestions } from "@/hooks/use-suggestions";

interface SuggestionsSectionProps {
  videoId: string;
}

export const SuggestionsSection = ({ videoId }: SuggestionsSectionProps) => {
  const { data: suggestions, isLoading } = useSuggestions(videoId);

  if (isLoading) {
    return <SuggestionsSectionSkeleton />;
  }

  return (
    <div className="space-y-3">
      {suggestions?.map((video) => (
        <VideoRowCard key={video.id} data={video} size="default" />
      ))}
    </div>
  );
};

export const SuggestionsSectionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
      </div>
    </>
  );
};
