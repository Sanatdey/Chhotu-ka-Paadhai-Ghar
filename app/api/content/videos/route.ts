import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: any | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// GET all videos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("[Videos GET Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch videos", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST - Create new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subject, difficultyLevel, url, remark } = body;

    // Validate required fields
    if (!title || !subject || !difficultyLevel || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        subject,
        difficultyLevel,
        url,
        class : body.class || "1",
        remark: remark || null,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("[Videos POST Error]", error);
    return NextResponse.json(
      { error: "Failed to create video", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PUT - Update video
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, subject, difficultyLevel, url, remark } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        subject,
        difficultyLevel,
        url,
        class : body.class || "1",
        remark: remark || null,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("[Videos PUT Error]", error);
    return NextResponse.json(
      { error: "Failed to update video", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete video
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("[Videos DELETE Error]", error);
    return NextResponse.json(
      { error: "Failed to delete video", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
