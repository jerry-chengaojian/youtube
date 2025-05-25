import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!existingVideo) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const suggestions = await prisma.video.findMany({
      where: {
        NOT: { id: videoId },
        visibility: "public",
        categoryId: existingVideo.categoryId || undefined,
      },
      include: {
        user: true,
        category: true,
        _count: {
          select: {
            videoViews: true,
            comments: true,
            videoReactions: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    const formattedSuggestions = suggestions.map((video) => ({
      ...video,
      videoViews: video._count.videoViews,
      comments: video._count.comments,
      videoReactions: video._count.videoReactions,
    }));

    return NextResponse.json(formattedSuggestions);
  } catch (error) {
    console.error("[SUGGESTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}