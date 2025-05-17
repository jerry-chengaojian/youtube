import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const videoId = params.videoId;

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
