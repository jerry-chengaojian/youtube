import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LIMIT } from "@/constants";

export async function GET(request: Request) {
  try {
    const videos = await prisma.video.findMany({
      where: {
        visibility: "public",
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
      take: DEFAULT_LIMIT,
      orderBy: {
        videoViews: {
          _count: "desc",
        },
      },
    });

    const formattedData = videos.map((video) => ({
      ...video,
      videoViews: video._count.videoViews,
      comments: video._count.comments,
      videoReactions: video._count.videoReactions,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("[TRENDING_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
