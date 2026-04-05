import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise - need to await it
    const params = await props.params;
    const idStr = params?.id;

    console.log(`[GET Worksheet] Raw params:`, params);
    console.log(`[GET Worksheet] ID string:`, idStr);

    if (!idStr) {
      return new Response(
        JSON.stringify({
          error: "Worksheet ID is missing from URL",
          details: "No ID parameter provided",
        }),
        { status: 400 }
      );
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({
          error: "Invalid worksheet ID",
          details: `ID must be a number, got: ${idStr}`,
        }),
        { status: 400 }
      );
    }

    console.log(`[GET Worksheet] Fetching worksheet with ID: ${id}`);

    const worksheet = await prisma.worksheet.findUnique({
      where: { id },
    });

    if (!worksheet) {
      return new Response(
        JSON.stringify({
          error: "Worksheet not found",
          details: `No worksheet with ID ${id}`,
        }),
        { status: 404 }
      );
    }

    console.log(`[GET Worksheet] Raw questions type: ${typeof worksheet.questions}`);
    console.log(`[GET Worksheet] Raw questions value:`, worksheet.questions);

    // Ensure questions are properly parsed
    let parsedQuestions = null;
    if (worksheet.questions) {
      if (typeof worksheet.questions === "string") {
        try {
          parsedQuestions = JSON.parse(worksheet.questions);
        } catch (parseErr) {
          console.error(`[GET Worksheet] Error parsing questions string:`, parseErr);
          parsedQuestions = worksheet.questions;
        }
      } else if (Array.isArray(worksheet.questions)) {
        parsedQuestions = worksheet.questions;
      } else {
        parsedQuestions = worksheet.questions;
      }
    }

    console.log(`[GET Worksheet] Parsed questions:`, parsedQuestions);

    const processedWorksheet = {
      ...worksheet,
      questions: parsedQuestions,
    };

    console.log(`[GET Worksheet] Final response:`, {
      id: worksheet.id,
      title: worksheet.title,
      questionsCount: Array.isArray(parsedQuestions) ? parsedQuestions.length : 0,
    });

    return new Response(JSON.stringify(processedWorksheet), { status: 200 });
  } catch (error) {
    console.error("[GET Worksheet] Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
