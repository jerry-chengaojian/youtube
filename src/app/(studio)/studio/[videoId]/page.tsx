import { VideoView } from "@/components/studio/views/video-view";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  return <VideoView videoId={videoId} />;
};

export default Page;
