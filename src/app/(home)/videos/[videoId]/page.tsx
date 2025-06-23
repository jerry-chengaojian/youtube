import { VideoView } from "@/components/video/views/video-view";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { videoId } = await params;
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    select: { title: true, description: true },
  });

  return {
    title: video?.title || "Video",
    description: video?.description || "YouTube video",
  };
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;
  return <VideoView videoId={videoId} />;
};

export default Page;
