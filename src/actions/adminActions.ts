"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function banUser(userId: string, ban: boolean) {
  await checkAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { banned: ban },
  });
  revalidatePath("/settings");
}

export async function warnUser(userId: string) {
  await checkAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { warnings: { increment: 1 } },
  });
  revalidatePath("/settings");
}

export async function adminDeleteComment(commentId: string) {
  await checkAdmin();
  await prisma.comment.delete({
    where: { id: commentId },
  });
  revalidatePath("/settings");
}
