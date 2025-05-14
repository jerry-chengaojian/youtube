import { VideoView } from "@/components/video/views/video-view";

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  return <VideoView videoId={videoId} />;
};

export default Page;
