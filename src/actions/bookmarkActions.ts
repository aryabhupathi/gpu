"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(forumId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_forumId: {
        userId: user.id,
        forumId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: { id: existingBookmark.id },
    });
    revalidatePath(`/forum/${forumId}`);
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        forumId,
      },
    });
    revalidatePath(`/forum/${forumId}`);
    return { bookmarked: true };
  }
}
