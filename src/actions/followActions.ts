"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleFollow(targetUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser) throw new Error("User not found");

  if (currentUser.id === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });
    revalidatePath(`/u/${targetUserId}`);
    return { followed: false };
  } else {
    await prisma.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "FOLLOW",
        message: `${currentUser.name || "Someone"} started following you.`,
        link: `/u/${currentUser.id}`
      }
    });

    revalidatePath(`/u/${targetUserId}`);
    return { followed: true };
  }
}
