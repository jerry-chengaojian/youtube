"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface InfiniteScrollProps {
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isManual?: boolean;
}

export function InfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isManual = false,
}: InfiniteScrollProps) {
  useEffect(() => {
    const handleScroll = () => {
      if (
        !isManual &&
        hasNextPage &&
        !isFetchingNextPage &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
      ) {
        fetchNextPage();
      }
    };

    if (!isManual) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isManual]);

  if (!hasNextPage) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <p className="text-xs text-muted-foreground">
          You have reached the end of the list
        </p>
      </div>
    );
  }

  if (isManual) {
    return (
      <div className="flex justify-center py-4">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      </div>
    );
  }

  return <div className="h-10" />;
}
