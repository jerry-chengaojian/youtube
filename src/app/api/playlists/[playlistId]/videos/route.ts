import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { playlistId } = await params;
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        videos: {
          include: {
            video: {
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
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!playlist) {
      return new NextResponse("Playlist not found", { status: 404 });
    }

    const formattedData = playlist.videos.map(({ video }) => ({
      ...video,
      videoViews: video._count.videoViews,
      comments: video._count.comments,
      videoReactions: video._count.videoReactions,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("[PLAYLIST_VIDEOS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
