import Link from "next/link";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import { Video } from "@/hooks/use-videos";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoMenu } from "./video-menu";
import { UserInfo } from "./user-info";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";

interface VideoGridCardProps {
  data: Video;
  onRemove?: () => void;
}

export const VideoGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Skeleton className="size-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="size-10 rounded-full flex-shrink-0" />
        <div className="min-w-0 flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <div className="flex-shrink-0">
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(data.videoViews);
  }, [data.videoViews]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link prefetch href={`/videos/${data.id}`}>
        <div className="relative w-full aspect-video overflow-hidden rounded-xl">
          <VideoThumbnail
            imageUrl={data.thumbnailUrl}
            title={data.title}
            duration={data.duration}
          />
        </div>
      </Link>
      <div className="flex gap-3">
        <Link prefetch href={`/users/${data.user.id}`}>
          <UserAvatar imageUrl={"/avatar.svg"} name={data.user.name} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link prefetch href={`/videos/${data.id}`}>
            <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
              {data.title}
            </h3>
          </Link>
          <Link prefetch href={`/users/${data.user.id}`}>
            <UserInfo name={data.user.name} />
          </Link>
          <Link prefetch href={`/videos/${data.id}`}>
            <p className="text-sm text-gray-600 line-clamp-1">
              {compactViews} views • {compactDate}
            </p>
          </Link>
        </div>
        <div className="flex-shrink-0">
          <VideoMenu videoId={data.id} onRemove={onRemove} />
        </div>
      </div>
    </div>
  );
};
