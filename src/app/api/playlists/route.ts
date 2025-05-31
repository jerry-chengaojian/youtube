import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const playlists = await prisma.playlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        videos: {
          include: {
            video: {
              select: {
                thumbnailUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const formattedPlaylists = playlists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      thumbnailUrl:
        playlist.videos.length > 0
          ? playlist.videos[0].video.thumbnailUrl ?? null
          : null,
      videoCount: playlist.videos.length,
    }));

    return NextResponse.json(formattedPlaylists);
  } catch (error) {
    console.error("[PLAYLISTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

const createPlaylistSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validation = createPlaylistSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const { name, description } = validation.data;

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId: session.user.id,
      },
    });

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("[PLAYLIST_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
