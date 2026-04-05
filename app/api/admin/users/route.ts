import { NextRequest, NextResponse } from "next/server";

declare global {
  var prisma: any | undefined;
}

const prisma = global.prisma || require("@prisma/client").PrismaClient;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

const prismaClient = new prisma.PrismaClient({ log: ["error"] });

export async function GET() {
  try {
    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        class: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, email, class: userClass } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(userClass && { class: userClass }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        class: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await prismaClient.user.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
