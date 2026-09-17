import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import PublicProfileClient from "./PublicProfileClient";
import { Metadata } from "next";
export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      image: true,
      xp: true,
      level: true,
      _count: { select: { followers: true } },
    },
  });
  if (!user) {
    return { title: "User Not Found | letstalk" };
  }
  const name = user.name || "Anonymous User";
  const desc = `Check out ${name}'s profile on letstalk! Level ${user.level} with ${user.xp} XP and ${user._count.followers} followers.`;
  return {
    title: `${name} (@${userId}) | letstalk`,
    description: desc,
    openGraph: {
      title: `${name} | letstalk`,
      description: desc,
      type: "profile",
      images: user.image ? [user.image] : [],
    },
    twitter: {
      card: "summary",
      title: name,
      description: desc,
      images: user.image ? [user.image] : [],
    },
  };
}
export default async function PublicProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      forums: {
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          tags: { include: { tag: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      followers: true,
      following: true,
      bookmarks: {
        include: {
          forum: {
            include: {
              user: true,
              tags: { include: { tag: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { followers: true, following: true, forums: true } },
    },
  });
  if (!user) {
    notFound();
  }
  const session = await getServerSession(authOptions);
  let isFollowing = false;
  let isSelf = false;
  if (session?.user?.email) {
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (currentUser) {
      if (currentUser.id === userId) {
        isSelf = true;
      } else {
        const followRecord = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.id,
              followingId: userId,
            },
          },
        });
        isFollowing = !!followRecord;
      }
    }
  }
  const serializedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    forums: user.forums
      .filter((f) => !f.isPrivate || isSelf || isFollowing)
      .map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
        tags: f.tags.map((t) => t.tag.name),
      })),
    bookmarks: user.bookmarks.map((b) => ({
      ...b.forum,
      createdAt: b.forum.createdAt.toISOString(),
      updatedAt: b.forum.updatedAt.toISOString(),
      tags: b.forum.tags.map((t) => t.tag.name),
    })),
  };
  return <PublicProfileClient profileUser={serializedUser} isFollowing={isFollowing} isSelf={isSelf} />;
}
