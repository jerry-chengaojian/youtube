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
    let cursorData: { id: string; likedAt: Date } | null = null;

    try {
      if (cursor) {
        const parsed = JSON.parse(cursor);
        if (parsed && typeof parsed === "object" && "likedAt" in parsed) {
          cursorData = {
            ...parsed,
            likedAt: new Date(parsed.likedAt),
          };
        }
      }
    } catch (e) {
      console.error("[CURSOR_PARSE_ERROR]", e);
    }

    const data = await prisma.videoReaction.findMany({
      where: {
        userId: session.user.id,
        type: "like",
        ...(cursorData && {
          OR: [
            { updatedAt: { lt: cursorData.likedAt } },
            {
              updatedAt: cursorData.likedAt,
              videoId: { lt: cursorData.id },
            },
          ],
        }),
      },
      include: {
        video: {
          include: {
            user: true,
            _count: {
              select: {
                videoViews: true,
                videoReactions: {
                  where: { type: "like" },
                },
              },
            },
          },
        },
      },
      take: limit + 1,
      orderBy: [{ updatedAt: "desc" }, { videoId: "desc" }],
    });

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, -1) : data;
    const lastItem = items[items.length - 1];

    const nextCursor = hasMore
      ? {
          id: lastItem.videoId,
          likedAt: lastItem.updatedAt,
        }
      : null;

    const formattedData = items.map((item) => ({
      ...item.video,
      user: item.video.user,
      likedAt: item.updatedAt,
      videoViews: item.video._count.videoViews,
      videoReactions: item.video._count.videoReactions,
    }));

    return NextResponse.json({
      items: formattedData,
      nextCursor,
    });
  } catch (error) {
    console.error("[LIKED_VIDEOS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}