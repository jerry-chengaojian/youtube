"use client";

import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { snakeCaseToTitle } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import { useVideos } from "@/hooks/use-videos";

export const VideosSection = () => {
  return <VideosSectionContent />;
};

const VideosSectionContent = () => {
  const router = useRouter();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useVideos();

  if (isError) {
    return (
      <div className="p-4 text-center text-destructive">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <VideosSectionSkeleton />;
  }

  const videos = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow
                key={video.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/studio/${video.id}`)}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <div className="relative aspect-video w-36 shrink-0">
                      <VideoThumbnail
                        imageUrl={video.thumbnailUrl}
                        title={video.title}
                        duration={video.duration || 0}
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden gap-y-1">
                      <span className="text-sm line-clamp-1">
                        {video.title}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {video.description || "No description"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {video.visibility === "private" ? (
                      <LockIcon className="size-4 mr-2" />
                    ) : (
                      <Globe2Icon className="size-4 mr-2" />
                    )}
                    {snakeCaseToTitle(video.visibility)}
                  </div>
                </TableCell>
                <TableCell className="text-sm truncate">
                  {format(new Date(video.createdAt), "d MMM yyyy")}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {video.viewCount}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {video.commentCount}
                </TableCell>
                <TableCell className="text-right text-sm pr-6">
                  {video.likeCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual={true}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <div className="border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[510px]">Video</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right pr-6">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="pl-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-36" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="text-right pr-6">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
