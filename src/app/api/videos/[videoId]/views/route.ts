import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const resolvedParams = await params;
    const videoId = resolvedParams.videoId;

    const viewCount = await prisma.videoView.count({
      where: {
        videoId: videoId,
      },
    });

    return NextResponse.json({ viewCount });
  } catch (error) {
    console.error("[VIDEO_VIEWS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const videoId = resolvedParams.videoId;

    // 创建或更新视频观看记录
    await prisma.videoView.upsert({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId: videoId,
        },
      },
      create: {
        userId: session.user.id,
        videoId: videoId,
      },
      update: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VIDEO_VIEWS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
