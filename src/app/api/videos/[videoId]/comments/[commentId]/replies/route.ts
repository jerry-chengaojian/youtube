import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string; commentId: string }> }
) {
  try {
    const { commentId, videoId } = await params;

    const replies = await prisma.comment.findMany({
      where: {
        parentId: commentId,
        videoId: videoId,
      },
      include: {
        user: true,
        replies: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error("[COMMENT_REPLIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
