import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

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
