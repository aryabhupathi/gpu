"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function getConversations() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");
  const convos = await prisma.conversation.findMany({
    where: {
      OR: [{ user1Id: user.id }, { user2Id: user.id }],
    },
    include: {
      user1: { select: { id: true, name: true, image: true } },
      user2: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return convos.map((c) => ({
    id: c.id,
    otherUser: c.user1Id === user.id ? c.user2 : c.user1,
    lastMessage: c.messages[0] || null,
    updatedAt: c.updatedAt,
  }));
}
export async function getMessages(conversationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });
  return messages;
}
export async function sendMessage(
  conversationId: string | null,
  recipientId: string,
  content: string,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  const sender = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!sender) throw new Error("User not found");
  let activeConvoId = conversationId;
  if (!activeConvoId) {
    const existing = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: sender.id, user2Id: recipientId },
          { user1Id: recipientId, user2Id: sender.id },
        ],
      },
    });
    if (existing) {
      activeConvoId = existing.id;
    } else {
      const newConvo = await prisma.conversation.create({
        data: {
          user1Id: sender.id,
          user2Id: recipientId,
        },
      });
      activeConvoId = newConvo.id;
    }
  }
  const message = await prisma.message.create({
    data: {
      conversationId: activeConvoId!,
      senderId: sender.id,
      content,
    },
  });
  await prisma.conversation.update({
    where: { id: activeConvoId! },
    data: { updatedAt: new Date() },
  });
  return message;
}
