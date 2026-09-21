import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Container, Typography } from "@mui/material";
import ProfileClient from "./ProfileClient";
export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h6" align="center">
          Please sign in to view your profile.
        </Typography>
      </Container>
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return null;
  }
  const forums = await prisma.forum.findMany({
    where: { userId: user.id },
    include: {
      user: true,
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  const comments = await prisma.comment.findMany({
    where: { userId: user.id },
    include: {
      forum: { select: { id: true, title: true } },
      _count: { select: { likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  const likedForums = await prisma.forumLike.findMany({
    where: { userId: user.id },
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
  });
  const formattedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
  const formattedForums = forums.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    tags: f.tags.map((t) => t.tag.name),
  }));
  const formattedComments = comments.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
  const formattedLikedForums = likedForums.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    forum: {
      ...l.forum,
      createdAt: l.forum?.createdAt.toISOString(),
      updatedAt: l.forum?.updatedAt.toISOString(),
      tags: l.forum?.tags.map((t) => t.tag.name) || [],
    },
  }));
  return (
    <ProfileClient
      user={formattedUser}
      forums={formattedForums}
      comments={formattedComments}
      likedForums={formattedLikedForums}
    />
  );
}
