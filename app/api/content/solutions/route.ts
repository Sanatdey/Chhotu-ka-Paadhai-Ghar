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

// GET all solutions
export async function GET() {
  try {
    const solutions = await prisma.solution.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(solutions);
  } catch (error) {
    console.error("[Solutions GET Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch solutions", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST - Create new solution
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

    const solution = await prisma.solution.create({
      data: {
        title,
        subject,
        difficultyLevel,
        url,
        remark: remark || null,
        class: body.class || "1",
      },
    });

    return NextResponse.json(solution, { status: 201 });
  } catch (error) {
    console.error("[Solutions POST Error]", error);
    return NextResponse.json(
      { error: "Failed to create solution", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PUT - Update solution
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, subject, difficultyLevel, url, remark } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Solution ID is required" },
        { status: 400 }
      );
    }

    const solution = await prisma.solution.update({
      where: { id },
      data: {
        title,
        subject,
        difficultyLevel,
        url,
        remark: remark || null,
        class: body.class || "1",
      },
    });

    return NextResponse.json(solution);
  } catch (error) {
    console.error("[Solutions PUT Error]", error);
    return NextResponse.json(
      { error: "Failed to update solution", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete solution
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Solution ID is required" },
        { status: 400 }
      );
    }

    await prisma.solution.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Solution deleted successfully" });
  } catch (error) {
    console.error("[Solutions DELETE Error]", error);
    return NextResponse.json(
      { error: "Failed to delete solution", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
