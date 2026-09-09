"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createForum(data: { title: string; description: string; tags: string[], mediaUrl?: string | null, isPrivate?: boolean }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  const forum = await prisma.forum.create({
    data: {
      title: data.title,
      description: data.description,
      mediaUrl: data.mediaUrl,
      isPrivate: data.isPrivate || false,
      userId: user.id,
      tags: {
        create: data.tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        })),
      },
    },
  });

  // Award XP for creating a forum post
  await prisma.user.update({
    where: { id: user.id },
    data: {
      xp: { increment: 10 }
    }
  });

  const { checkAndAwardBadges } = await import("@/lib/gamification");
  await checkAndAwardBadges(user.id);

  revalidatePath("/forum");
  return forum;
}

export async function updateForum(forumId: string, data: { title: string; description: string; tags: string[] }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  await prisma.forum.update({
    where: { id: forumId },
    data: {
      title: data.title,
      description: data.description,
    },
  });

  await prisma.forumTag.deleteMany({ where: { forumId } });

  for (const tagName of data.tags) {
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
    await prisma.forumTag.create({
      data: { forumId, tagId: tag.id },
    });
  }

  revalidatePath(`/forum/${forumId}`);
  revalidatePath("/forum");
}

export async function toggleForumLike(forumId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  const forum = await prisma.forum.findUnique({ where: { id: forumId } });
  if (!forum) throw new Error("Forum not found");

  if (forum.userId === user.id) {
    throw new Error("You cannot like your own forum");
  }

  const existingLike = await prisma.forumLike.findUnique({
    where: {
      userId_forumId: {
        userId: user.id,
        forumId,
      },
    },
  });

  if (existingLike) {
    await prisma.forumLike.delete({
      where: {
        userId_forumId: {
          userId: user.id,
          forumId,
        },
      },
    });
  } else {
    await prisma.forumLike.create({
      data: {
        userId: user.id,
        forumId,
      },
    });

    await prisma.notification.create({
      data: {
        userId: forum.userId,
        type: "LIKE",
        message: `${user.name || "Someone"} liked your post "${forum.title.substring(0, 20)}..."`,
        link: `/forum/${forum.id}`,
      }
    });
  }

  const likeCount = await prisma.forumLike.count({
    where: { forumId },
  });

  revalidatePath(`/forum/${forumId}`);
  return { liked: !existingLike, likeCount };
}

export async function deleteForum(forumId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("Unauthorized");

  const existing = await prisma.forum.findUnique({
    where: { id: forumId },
    include: { user: true },
  });

  if (!existing) throw new Error("Forum not found");

  if (existing.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  await prisma.forum.delete({ where: { id: forumId } });

  revalidatePath("/forum");
  revalidatePath("/profile");
}

export async function archiveForum(forumId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "ADMIN") {
    throw new Error("Forbidden - Admins only");
  }

  const existing = await prisma.forum.findUnique({ where: { id: forumId } });
  if (!existing) throw new Error("Forum not found");

  await prisma.forum.update({
    where: { id: forumId },
    data: { archived: !existing.archived },
  });

  revalidatePath(`/forum/${forumId}`);
  revalidatePath("/forum");
}
