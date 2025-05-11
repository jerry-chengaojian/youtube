import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Extract file extension
    const fileExtension = file.name.split(".").pop();
    // Generate a unique filename using uuid and append the file extension
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    // Create a ReadableStream from the file
    const stream = file.stream();

    // Upload to Vercel Blob using the stream
    const { url } = await put(uniqueFileName, stream, {
      access: "public",
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
