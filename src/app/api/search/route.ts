import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const forums = await prisma.forum.findMany({
      where: {
        isPrivate: false,
        OR: [
          { title: { contains: query } },
          { tags: { some: { tag: { name: { contains: query } } } } }
        ]
      },
      select: {
        id: true,
        title: true,
      },
      take: 5,
    });

    const users = await prisma.user.findMany({
      where: {
        name: { contains: query }
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      take: 3,
    });

    return NextResponse.json({ forums, users });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
