"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
export async function addComment(
  forumId: string,
  content: string,
  parentId?: string,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) throw new Error("User not found");
  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      forumId,
      parentId: parentId || null,
    },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: 5 } },
  });
  const { checkAndAwardBadges } = await import("@/lib/gamification");
  await checkAndAwardBadges(user.id);
  const forum = await prisma.forum.findUnique({ where: { id: forumId } });
  if (forum && forum.userId !== user.id) {
    await prisma.notification.create({
      data: {
        userId: forum.userId,
        type: "COMMENT",
        message: `${user.name || "Someone"} commented on your post "${forum.title.substring(0, 20)}..."`,
        link: `/forum/${forumId}`,
      },
    });
  }
  revalidatePath(`/forum/${forumId}`);
  return comment;
}
export async function toggleCommentLike(commentId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) throw new Error("User not found");
  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId: user.id,
        commentId,
      },
    },
  });
  let liked = false;
  if (existingLike) {
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });
  } else {
    await prisma.commentLike.create({
      data: {
        userId: user.id,
        commentId,
      },
    });
    liked = true;
  }
  const likeCount = await prisma.commentLike.count({
    where: { commentId },
  });
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (comment) {
    revalidatePath(`/forum/${comment.forumId}`);
  }
  return { liked, likeCount };
}
