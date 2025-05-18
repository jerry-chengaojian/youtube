import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { userId } = await params;
    if (userId === session.user.id) {
      return new NextResponse("You cannot subscribe to yourself", {
        status: 400,
      });
    }

    await prisma.subscription.create({
      data: {
        viewerId: session.user.id,
        creatorId: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SUBSCRIPTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId } = await params;
    if (userId === session.user.id) {
      return new NextResponse("You cannot unsubscribe from yourself", {
        status: 400,
      });
    }

    await prisma.subscription.delete({
      where: {
        viewerId_creatorId: {
          viewerId: session.user.id,
          creatorId: userId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SUBSCRIPTION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
