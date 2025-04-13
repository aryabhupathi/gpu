import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const forums = await prisma.forum.findMany({
      where: {
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        likes: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const transformedForums = forums.map((forum) => ({
      ...forum,
      hasLiked: forum.likes.length > 0,
    }));
    return NextResponse.json(transformedForums);
  } catch (error) {
    console.error("Error fetching user forums:", error);
    return NextResponse.json(
      { error: "Failed to fetch user forums" },
      { status: 500 }
    );
  }
}
