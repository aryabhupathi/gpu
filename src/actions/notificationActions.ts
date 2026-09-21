"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function getNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) return [];
  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
export async function markNotificationsAsRead() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) return;
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
}
