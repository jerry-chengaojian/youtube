import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const count = await prisma.subscription.count({
      where: {
        creatorId: userId,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("[SUBSCRIBER_COUNT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
