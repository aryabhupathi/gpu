import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const commentId = params.id;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const existingLike = await prisma.commentLike.findFirst({
      where: { userId: user.id, commentId },
    });
    if (existingLike) {
      await prisma.commentLike.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.commentLike.create({
        data: { userId: user.id, commentId },
      });
    }
    const count = await prisma.commentLike.count({ where: { commentId } });
    return NextResponse.json({ liked: !existingLike, count });
  } catch (error) {
    console.error("Error in POST /api/comments/[id]/like:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
