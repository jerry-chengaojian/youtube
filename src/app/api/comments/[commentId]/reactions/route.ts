import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ videoId: string; commentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { commentId } = await params;
    const { type } = await request.json();
    const userId = session.user.id;

    await prisma.commentReaction.upsert({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
      update: {
        type,
      },
      create: {
        userId,
        commentId,
        type,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[COMMENT_REACTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
