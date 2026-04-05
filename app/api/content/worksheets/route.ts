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

// GET all worksheets
export async function GET() {
  try {
    const worksheets = await prisma.worksheet.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Ensure questions are properly parsed
    const processedWorksheets = worksheets.map((ws: any) => ({
      ...ws,
      questions: ws.questions
        ? typeof ws.questions === "string"
          ? JSON.parse(ws.questions)
          : ws.questions
        : null,
    }));
    
    return NextResponse.json(processedWorksheets);
  } catch (error) {
    console.error("[Worksheets GET Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch worksheets", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST - Create new worksheet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, subject,  difficultyLevel, pdfUrl, solutionVideoUrl, questions, remark, json } = body;
    const myClass = (body.class); // 'class' is a reserved keyword, so we use 'myClass' to avoid conflicts
    // Validate required fields
    if (!title || !subject || !difficultyLevel || !pdfUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const worksheet = await prisma.worksheet.create({
      data: {
        title,
        description: description || null,
        subject,
        difficultyLevel,
        pdfUrl,
        solutionVideoUrl: solutionVideoUrl || null,
        questions: json && json.questions ? json : null,
        remark: remark || null,
        class :  myClass || "1",
      },
    });

    console.log("[POST Worksheet] Created worksheet:", { id: worksheet.id, title, questionsCount: worksheet.questions ? (Array.isArray(worksheet.questions) ? worksheet.questions.length : 0) : 0 });

    return NextResponse.json(worksheet, { status: 201 });
  } catch (error) {
    console.error("[Worksheets POST Error]", error);
    return NextResponse.json(
      { error: "Failed to create worksheet", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PUT - Update worksheet
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, subject, difficultyLevel, pdfUrl, solutionVideoUrl, questions,json, remark } = body;
    const myClass = (body.class); // 'class' is a reserved keyword, so we use 'myClass' to avoid conflicts

    if (!id) {
      return NextResponse.json(
        { error: "Worksheet ID is required" },
        { status: 400 }
      );
    }

    const worksheet = await prisma.worksheet.update({
      where: { id },
      data: {
        title,
        description: description || null,
        subject,
        difficultyLevel,
        pdfUrl,
        solutionVideoUrl: solutionVideoUrl || null,
        questions: json && json.questions ? json : null,
        remark: remark || null,
        class : myClass || null,
      },
    });

    console.log("[PUT Worksheet] Updated worksheet:", { id: worksheet.id, title, questionsCount: worksheet.questions ? (Array.isArray(worksheet.questions) ? worksheet.questions.length : 0) : 0 });

    return NextResponse.json(worksheet);
  } catch (error) {
    console.error("[Worksheets PUT Error]", error);
    return NextResponse.json(
      { error: "Failed to update worksheet", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete worksheet
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Worksheet ID is required" },
        { status: 400 }
      );
    }

    await prisma.worksheet.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Worksheet deleted successfully" });
  } catch (error) {
    console.error("[Worksheets DELETE Error]", error);
    return NextResponse.json(
      { error: "Failed to delete worksheet", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
