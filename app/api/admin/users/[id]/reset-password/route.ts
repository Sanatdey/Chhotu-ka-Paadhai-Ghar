import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

declare global {
  var prisma: any | undefined;
}

const prisma = global.prisma || require("@prisma/client").PrismaClient;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

const prismaClient = new prisma.PrismaClient({ log: ["error"] });

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { newPassword } = await request.json();
    const userId = parseInt(params.id);

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        class: true,
        isAdmin: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Failed to reset password:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}
