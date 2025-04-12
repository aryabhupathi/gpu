import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        forum: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to include forumTitle and forumId
    const formatted = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      forumId: comment.forum.id,
      forumTitle: comment.forum.title,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return NextResponse.json({ error: 'Failed to fetch user comments' }, { status: 500 });
  }
}
