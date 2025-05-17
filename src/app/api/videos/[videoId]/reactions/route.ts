import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { videoId } = await params;

    const [likes, dislikes] = await Promise.all([
      prisma.videoReaction.count({
        where: {
          videoId,
          type: "like",
        },
      }),
      prisma.videoReaction.count({
        where: {
          videoId,
          type: "dislike",
        },
      }),
    ]);

    const viewerReaction = userId
      ? await prisma.videoReaction.findUnique({
          where: {
            userId_videoId: {
              userId,
              videoId,
            },
          },
          select: {
            type: true,
          },
        })
      : null;

    return NextResponse.json({
      likes,
      dislikes,
      viewerReaction: viewerReaction?.type || null,
    });
  } catch (error) {
    console.error("[VIDEO_REACTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
