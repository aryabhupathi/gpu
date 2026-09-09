import prisma from "@/lib/prisma";
import EditForumClient from "./EditForumClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function EditForumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const forum = await prisma.forum.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      user: true,
    },
  });

  if (!forum) return notFound();

  if (forum.user.email !== session.user.email) {
    redirect("/profile");
  }

  const formattedForum = {
    ...forum,
    tags: forum.tags.map(ft => ft.tag),
  };

  return <EditForumClient forum={formattedForum} />;
}
