import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const forum = await prisma.forum.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        comments: true,
        likes: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: { select: { likes: true } },
      },
    });
    if (!forum) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    let userLiked = false;
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
      if (user) {
        userLiked = forum.likes.some((like) => like.userId === user.id);
      }
    }
    return NextResponse.json({
      ...forum,
      userLiked,
      tags: forum.tags.map((forumTag) => forumTag.tag.name),
    });
  } catch (err) {
    console.error("Error fetching forum:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, description, tags } = body;
    const forumId = params.id;
    await prisma.forum.update({
      where: { id: forumId },
      data: {
        title,
        description,
      },
    });
    await prisma.forumTag.deleteMany({
      where: { forumId },
    });
    for (const tagName of tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      await prisma.forumTag.create({
        data: {
          forumId,
          tagId: tag.id,
        },
      });
    }
    const updatedForum = await prisma.forum.findUnique({
      where: { id: forumId },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    return NextResponse.json(updatedForum);
  } catch (error: any) {
    console.error(" Forum update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await prisma.forum.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  if (existing?.user?.email !== session.user?.email)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.forum.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Forum deleted" });
}
export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const forum = await prisma.forum.findUnique({
    where: { id: params.id },
  });
  if (!forum) {
    return NextResponse.json({ error: "Forum not found" }, { status: 404 });
  }
  if (forum.userId === user.id) {
    return NextResponse.json(
      { error: "You cannot like your own forum" },
      { status: 400 }
    );
  }
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_forumId: {
        userId: user.id,
        forumId: params.id,
      },
    },
  });
  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_forumId: {
          userId: user.id,
          forumId: params.id,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: user.id,
        forumId: params.id,
      },
    });
  }
  const likeCount = await prisma.like.count({
    where: { forumId: params.id },
  });
  return NextResponse.json({
    liked: !existingLike,
    likeCount,
  });
}
