import Link from "next/link";
import { PlaylistInfo, PlaylistInfoSkeleton } from "./playlist-info";
import {
  PlaylistThumbnail,
  PlaylistThumbnailSkeleton,
} from "./playlist-thumbnail";

interface PlaylistGridCardProps {
  data: {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    videoCount: number;
  };
}

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
};

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link prefetch href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          imageUrl={data.thumbnailUrl}
          title={data.name}
          videoCount={data.videoCount}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
};
