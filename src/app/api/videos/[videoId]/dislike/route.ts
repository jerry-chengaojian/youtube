import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { videoId } = await params;
    const userId = session.user.id;

    await prisma.videoReaction.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      update: {
        type: "dislike",
      },
      create: {
        userId,
        videoId,
        type: "dislike",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VIDEO_DISLIKE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
