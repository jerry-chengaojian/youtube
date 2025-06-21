import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LIMIT } from "@/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
    const cursor = searchParams.get("cursor");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");
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

    const videos = await prisma.video.findMany({
      where: {
        visibility: "public",
        ...(categoryId && { categoryId }),
        ...(userId && { userId }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
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
    console.error("[FEED_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
