import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const forums = await prisma.forum.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(forums);
  } catch (error) {
    console.error('Error fetching user forums:', error);
    return NextResponse.json({ error: 'Failed to fetch user forums' }, { status: 500 });
  }
}
