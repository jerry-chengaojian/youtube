import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const RANDOM_TITLES = [
  "My Awesome Video",
  "Check This Out",
  "Amazing Content",
  "New Video",
  "Must Watch",
  "Exciting Video",
  "Special Moment",
  "Great Creation",
  "Cool Video",
  "Interesting Footage",
];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return new NextResponse("Video URL is required", { status: 400 });
    }

    const randomTitle =
      RANDOM_TITLES[Math.floor(Math.random() * RANDOM_TITLES.length)];

    const video = await prisma.video.create({
      data: {
        title: randomTitle,
        videoUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("[VIDEOS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
