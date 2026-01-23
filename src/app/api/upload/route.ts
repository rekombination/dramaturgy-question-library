import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sharp from "sharp";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 15MB limit" },
        { status: 400 }
      );
    }

    // Check file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos are allowed" },
        { status: 400 }
      );
    }

    // Check if Vercel Blob is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN not configured");
      return NextResponse.json(
        { error: "File upload is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const { put } = await import("@vercel/blob");

    // For images, convert to AVIF and WebP
    if (isImage) {
      const buffer = await file.arrayBuffer();
      const baseFilename = file.name.replace(/\.[^/.]+$/, "");

      // Convert to AVIF (best compression, modern browsers)
      const avifBuffer = await sharp(buffer)
        .avif({ quality: 80, effort: 4 })
        .toBuffer();

      // Convert to WebP (good compression, wider support)
      const webpBuffer = await sharp(buffer)
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      // Upload both formats
      const [avifBlob, webpBlob] = await Promise.all([
        put(`${baseFilename}.avif`, avifBuffer, {
          access: "public",
          addRandomSuffix: true,
          contentType: "image/avif",
        }),
        put(`${baseFilename}.webp`, webpBuffer, {
          access: "public",
          addRandomSuffix: true,
          contentType: "image/webp",
        }),
      ]);

      return NextResponse.json({
        url: avifBlob.url, // Use AVIF as primary
        webpUrl: webpBlob.url, // Fallback to WebP
        type: "image",
        size: avifBuffer.length,
        name: file.name,
      });
    }

    // For videos, upload as-is
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      type: "video",
      size: file.size,
      name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
