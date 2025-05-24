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
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const cursor = searchParams.get("cursor");
    let cursorData: { id: string; createdAt: Date } | null = null;

    try {
      if (cursor) {
        const parsed = JSON.parse(cursor);
        if (parsed && typeof parsed === "object" && "createdAt" in parsed) {
          cursorData = {
            ...parsed,
            createdAt: new Date(parsed.createdAt),
          };
        }
      }
    } catch (e) {
      console.error("[CURSOR_PARSE_ERROR]", e);
    }

    const totalComments = await prisma.comment.count({
      where: { videoId },
    });

    const comments = await prisma.comment.findMany({
      where: {
        videoId,
        parentId: null,
        ...(cursorData && {
          createdAt: {
            lt: cursorData.createdAt,
          },
        }),
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
      take: limit + 1,
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

    const hasMore = commentsWithReactions.length > limit;
    const data = hasMore
      ? commentsWithReactions.slice(0, -1)
      : commentsWithReactions;
    const lastItem = data[data.length - 1];
    const nextCursor =
      hasMore && lastItem
        ? {
            id: lastItem.id,
            createdAt: lastItem.createdAt,
          }
        : null;

    const formattedComments = data.map((comment) => ({
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
      items: formattedComments,
      nextCursor,
    });
  } catch (error) {
    console.error("[COMMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
