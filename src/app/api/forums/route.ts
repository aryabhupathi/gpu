import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET() {
  const forums = await prisma.forum.findMany({
    include: {
      user: true,
      tags: { include: { tag: true } },
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: "desc" },
  });
  console.log("Forums with tags:", forums); 
  return NextResponse.json(forums);
}
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { title, description, tags } = await req.json();
    const tagConnections = tags.map((tagName: string) => ({
      tag: {
        connectOrCreate: {
          where: { name: tagName.toLowerCase() },
          create: { name: tagName.toLowerCase() },
        },
      },
    }));
    const forum = await prisma.forum.create({
      data: {
        title,
        description,
        user: {
          connect: { email: session.user.email },
        },
        tags: {
          create: tagConnections,
        },
      },
      include: {
        tags: { include: { tag: true } },
        user: true,
      },
    });
    return NextResponse.json(forum);
  } catch (error) {
    console.error("Error creating forum:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
