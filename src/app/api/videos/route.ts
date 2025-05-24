import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LIMIT } from "@/constants";

const RANDOM_TITLES = [
  "My Awesome Video",
  "Check This Out",
  "Amazing Content",
  "New Video",
  "Must Watch",
  "Exciting Video",
  "Special Moment",
  "Great Creation",
  "Cool Video",
  "Interesting Footage",
];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { videoUrl, duration } = await req.json();

    if (!videoUrl) {
      return new NextResponse("Video URL is required", { status: 400 });
    }

    const randomTitle =
      RANDOM_TITLES[Math.floor(Math.random() * RANDOM_TITLES.length)];

    const video = await prisma.video.create({
      data: {
        title: randomTitle,
        videoUrl,
        duration,
        userId: session.user.id,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("[VIDEOS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    const videos = await prisma.video.findMany({
      where: {
        userId: session.user.id,
        ...(cursorData && {
          updatedAt: {
            lt: cursorData.updatedAt,
          },
        }),
      },
      take: limit + 1,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: true,
        category: true,
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
    });

    const hasMore = videos.length > limit;
    const data = hasMore ? videos.slice(0, -1) : videos;
    const lastItem = data[data.length - 1];
    const nextCursor =
      hasMore && lastItem
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

    const formattedData = data.map((video) => ({
      ...video,
      videoViews: video._count.videoViews,
      comments: video._count.comments,
      videoReactions: video._count.videoReactions,
    }));

    return NextResponse.json({
      items: formattedData,
      nextCursor,
    });
  } catch (error) {
    console.error("[STUDIO_VIDEOS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
