import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: {
      userId_forumId: {
        userId: user.id,
        forumId: params.id
      }
    }
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_forumId: { userId: user.id, forumId: params.id } }
    });
  } else {
    await prisma.like.create({
      data: {
        userId: user.id,
        forumId: params.id
      }
    });
  }

  const count = await prisma.like.count({
    where: { forumId: params.id }
  });

  return NextResponse.json({
    liked: !existing,
    likeCount: count
  });
}
