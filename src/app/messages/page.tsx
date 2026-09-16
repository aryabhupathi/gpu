import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      following: { include: { following: { select: { id: true, name: true, image: true } } } },
      followers: { include: { follower: { select: { id: true, name: true, image: true } } } }
    }
  });

  if (!user) redirect("/");

  // Get mutual followers to allow messaging
  const followingIds = user.following.map(f => f.following.id);
  const mutuals = user.followers
    .filter(f => followingIds.includes(f.follower.id))
    .map(f => f.follower);

  return <MessagesClient currentUser={user} mutuals={mutuals} />;
}
