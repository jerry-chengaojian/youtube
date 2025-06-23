import { PlaylistDetailView } from "@/components/playlists/views/playlist-detail-view";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { playlistId } = await params;
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
    select: { name: true, description: true },
  });

  return {
    title: `${playlist?.name} | YouTube Clone`,
    description: playlist?.description || "YouTube playlist",
  };
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;
  return <PlaylistDetailView playlistId={playlistId} />;
};

export default Page;
