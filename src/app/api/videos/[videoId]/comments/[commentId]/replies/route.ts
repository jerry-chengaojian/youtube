import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string; commentId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { commentId, videoId } = await params;

    const replies = await prisma.comment.findMany({
      where: {
        parentId: commentId,
        videoId: videoId,
      },
      include: {
        user: true,
        replies: {
          select: {
            id: true,
          },
        },
        reactions: userId
          ? {
              where: {
                userId,
              },
              select: {
                type: true,
              },
            }
          : false,
        _count: {
          select: {
            replies: true,
            reactions: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const repliesWithReactions = await Promise.all(
      replies.map(async (reply) => {
        const [likes, dislikes] = await Promise.all([
          prisma.commentReaction.count({
            where: {
              commentId: reply.id,
              type: "like",
            },
          }),
          prisma.commentReaction.count({
            where: {
              commentId: reply.id,
              type: "dislike",
            },
          }),
        ]);

        return {
          ...reply,
          likes,
          dislikes,
        };
      })
    );

    const formattedReplies = repliesWithReactions.map((reply) => ({
      ...reply,
      replyCount: reply._count.replies,
      likes: reply.likes,
      dislikes: reply.dislikes,
      viewerReaction: reply.reactions?.[0]?.type || null,
      replies: undefined,
      reactions: undefined,
      _count: undefined,
    }));

    return NextResponse.json(formattedReplies);
  } catch (error) {
    console.error("[COMMENT_REPLIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
