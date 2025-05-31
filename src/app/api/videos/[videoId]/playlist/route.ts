import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ videoId: string }> }
  ) {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const { videoId } = await params;
      const userId = session.user.id;
  
      // Get all playlists for the current user
      const playlists = await prisma.playlist.findMany({
        where: {
          userId,
        },
        include: {
          videos: {
            where: {
              videoId,
            },
            select: {
              videoId: true,
            },
          },
        },
      });
  
      // Format the response to include whether video exists in each playlist
      const formattedPlaylists = playlists.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        hasVideo: playlist.videos.length > 0,
      }));
  
      return NextResponse.json(formattedPlaylists);
    } catch (error) {
      console.error("[VIDEO_PLAYLISTS_GET]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }