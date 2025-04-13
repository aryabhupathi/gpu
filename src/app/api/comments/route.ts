import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { forumId, content } = await req.json();
  if (!content.trim()) {
    return NextResponse.json(
      { error: "Comment content cannot be empty" },
      { status: 400 }
    );
  }
  const comment = await prisma.comment.create({
    data: {
      content,
      forum: { connect: { id: forumId } },
      user: { connect: { email: session.user.email } },
    },
    include: {
      user: true,
    },
  });
  return NextResponse.json(comment);
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const forumId = searchParams.get("forumId");
  if (!forumId)
    return NextResponse.json({ error: "Forum ID required" }, { status: 400 });
  const comments = await prisma.comment.findMany({
    where: { forumId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}
