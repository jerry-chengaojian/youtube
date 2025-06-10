import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { playlistId } = await params;

    // First, check if the playlist exists and belongs to the current user
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
        userId: session.user.id,
      },
    });

    if (!playlist) {
      return new NextResponse("Playlist not found", { status: 404 });
    }

    // Use a transaction to delete the playlist and its associated video records
    await prisma.$transaction([
      prisma.playlistVideo.deleteMany({
        where: {
          playlistId,
        },
      }),
      prisma.playlist.delete({
        where: {
          id: playlistId,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PLAYLIST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
