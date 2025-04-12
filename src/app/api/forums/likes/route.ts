// app/api/forums/likes/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { forumId, liked } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (liked) {
    // Add like
    await prisma.like.upsert({
      where: { userId_forumId: { userId: user.id, forumId } },
      update: {},
      create: { userId: user.id, forumId },
    });
  } else {
    // Remove like
    await prisma.like.deleteMany({
      where: { userId: user.id, forumId },
    });
  }

  // Get the updated like count
  const updatedForum = await prisma.forum.findUnique({
    where: { id: forumId },
    select: {
      _count: { select: { likes: true } },
    },
  });

  return NextResponse.json({ success: true, likes: updatedForum?._count.likes || 0 });
}
