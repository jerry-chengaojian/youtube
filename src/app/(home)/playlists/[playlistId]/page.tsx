import { VideosView } from "@/components/playlists/views/videos-view";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;

  return <VideosView playlistId={playlistId} />;
};

export default Page;
