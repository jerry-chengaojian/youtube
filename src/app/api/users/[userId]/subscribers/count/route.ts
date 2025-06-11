import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth();

  try {
    const [count, user, videoCount] = await Promise.all([
      prisma.subscription.count({
        where: {
          creatorId: userId,
        },
      }),
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
        },
      }),
      prisma.video.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    const isSubscribed = session?.user?.id
      ? await prisma.subscription.findUnique({
          where: {
            viewerId_creatorId: {
              viewerId: session.user.id,
              creatorId: userId,
            },
          },
        })
      : false;

    return NextResponse.json({
      count,
      isSubscribed: !!isSubscribed,
      userName: user?.name,
      videoCount,
    });
  } catch (error) {
    console.error("[SUBSCRIBER_COUNT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
