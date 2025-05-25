"use client";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "../components/video-grid-card";
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
    return (
      <>
        <div className="hidden md:block space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoRowCardSkeleton key={index} size="default" />
          ))}
        </div>
        <div className="block md:hidden space-y-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoGridCardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestions?.map((video) => (
          <VideoRowCard key={video.id} data={video} size="default" />
        ))}
      </div>
      <div className="block md:hidden space-y-10">
        {suggestions?.map((video) => (
          <VideoGridCard key={video.id} data={video} />
        ))}
      </div>
    </>
  );
};
