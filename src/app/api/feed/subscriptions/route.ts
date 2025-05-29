import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { DEFAULT_LIMIT } from "@/constants";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
    const cursor = searchParams.get("cursor");
    let cursorData: { id: string; updatedAt: Date } | null = null;

    try {
      if (cursor) {
        const parsed = JSON.parse(cursor);
        if (parsed && typeof parsed === "object" && "updatedAt" in parsed) {
          cursorData = {
            ...parsed,
            updatedAt: new Date(parsed.updatedAt),
          };
        }
      }
    } catch (e) {
      console.error("[CURSOR_PARSE_ERROR]", e);
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        viewerId: session.user.id,
      },
      select: {
        creatorId: true,
      },
    });

    const creatorIds = subscriptions.map((sub) => sub.creatorId);

    const videos = await prisma.video.findMany({
      where: {
        userId: { in: creatorIds },
        visibility: "public",
        ...(cursorData && {
          updatedAt: {
            lt: cursorData.updatedAt,
          },
        }),
      },
      include: {
        user: true,
        _count: {
          select: {
            videoViews: true,
            comments: true,
            videoReactions: {
              where: {
                type: "like",
              },
            },
          },
        },
      },
      take: limit + 1,
      orderBy: {
        updatedAt: "desc",
      },
    });

    const hasMore = videos.length > limit;
    const items = hasMore ? videos.slice(0, -1) : videos;
    const lastItem = items[items.length - 1];

    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          updatedAt: lastItem.updatedAt,
        }
      : null;

    const formattedData = items.map((video) => ({
      ...video,
      videoViews: video._count.videoViews,
      commentCount: video._count.comments,
      likeCount: video._count.videoReactions,
    }));

    return NextResponse.json({
      items: formattedData,
      nextCursor,
    });
  } catch (error) {
    console.error("[SUBSCRIPTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
