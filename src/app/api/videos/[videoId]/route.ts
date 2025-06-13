import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ videoId: string }>;
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        category: true,
      },
    });

    if (!video) {
      return new NextResponse("Video not found", { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("[VIDEO_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: PageProps) {
  try {
    const session = await auth();
    const { title, description, thumbnailUrl, categoryId, visibility } =
      await req.json();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { videoId } = await params;
    const video = await prisma.video.update({
      where: {
        id: videoId,
        userId: session.user.id,
      },
      data: {
        title,
        description,
        thumbnailUrl,
        categoryId,
        visibility,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("[VIDEO_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: PageProps) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { videoId } = await params;
    await prisma.video.delete({
      where: {
        id: videoId,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[VIDEO_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
