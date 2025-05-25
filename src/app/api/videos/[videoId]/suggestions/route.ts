import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const session = await auth();

    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!existingVideo) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const categoryVideos = prisma.video.findMany({
      where: {
        NOT: { id: videoId },
        visibility: "public",
        categoryId: existingVideo.categoryId || undefined,
        ...(session?.user
          ? {
              videoViews: {
                none: {
                  userId: session.user.id,
                },
              },
            }
          : {}),
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
      take: 10,
    });

    const authorVideos = prisma.video.findMany({
      where: {
        NOT: { id: videoId },
        visibility: "public",
        userId: existingVideo.userId,
        ...(session?.user
          ? {
              videoViews: {
                none: {
                  userId: session.user.id,
                },
              },
            }
          : {}),
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
      take: 10,
    });

    const subscribedUsersLikedVideos = session?.user
      ? prisma.video.findMany({
          where: {
            NOT: { id: videoId },
            visibility: "public",
            videoViews: {
              none: {
                userId: session.user.id,
              },
            },
            videoReactions: {
              some: {
                type: "like",
                user: {
                  subscribers: {
                    some: {
                      viewerId: session.user.id,
                    },
                  },
                },
              },
            },
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
          take: 10,
        })
      : Promise.resolve([]);

    // Get all videos in parallel
    const [categorySuggestions, authorSuggestions, likedSuggestions] =
      await Promise.all([
        categoryVideos,
        authorVideos,
        subscribedUsersLikedVideos,
      ]);

    // Merge all videos and remove duplicates
    const allVideos = [
      ...categorySuggestions,
      ...authorSuggestions,
      ...likedSuggestions,
    ].filter(
      (video, index, self) => index === self.findIndex((v) => v.id === video.id)
    );

    const shuffledVideos = allVideos
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const formattedSuggestions = shuffledVideos.map((video) => ({
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