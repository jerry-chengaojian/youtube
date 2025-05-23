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
    const { parentId, value } = await request.json();

    const comment = await prisma.comment.create({
      data: {
        videoId,
        userId: session.user.id,
        parentId,
        value,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("[COMMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { videoId } = await params;

    const totalComments = await prisma.comment.count({
      where: { videoId },
    });

    const comments = await prisma.comment.findMany({
      where: { videoId, parentId: null },
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
        createdAt: "desc",
      },
    });

    const commentsWithReactions = await Promise.all(
      comments.map(async (comment) => {
        const [likes, dislikes] = await Promise.all([
          prisma.commentReaction.count({
            where: {
              commentId: comment.id,
              type: "like",
            },
          }),
          prisma.commentReaction.count({
            where: {
              commentId: comment.id,
              type: "dislike",
            },
          }),
        ]);

        return {
          ...comment,
          likes,
          dislikes,
        };
      })
    );

    const formattedComments = commentsWithReactions.map((comment) => ({
      ...comment,
      replyCount: comment._count.replies,
      likes: comment.likes,
      dislikes: comment.dislikes,
      viewerReaction: comment.reactions?.[0]?.type || null,
      replies: undefined,
      reactions: undefined,
      _count: undefined,
    }));

    return NextResponse.json({
      totalComments,
      comments: formattedComments,
    });
  } catch (error) {
    console.error("[COMMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
