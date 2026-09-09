import ForumCard from "@/components/forum/ForumCard";
import { Typography, Container } from "@mui/material";
import prisma from "@/lib/prisma";
import SearchFilter from "@/components/common/SearchFilter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ForumListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams in Next.js 15 before using properties
  const params = await searchParams;
  const q = typeof params?.q === 'string' ? params.q : "";
  const sort = typeof params?.sort === 'string' ? params.sort : "latest";

  const session = await getServerSession(authOptions);
  let currentUser = null;
  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  }

  const forums = await prisma.forum.findMany({
    where: {
      AND: [
        {
          ...(q ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { tags: { some: { tag: { name: { contains: q } } } } }
            ]
          } : {})
        },
        {
          OR: [
            { isPrivate: false },
            ...(currentUser ? [
              { userId: currentUser.id },
              { user: { followers: { some: { followerId: currentUser.id } } } }
            ] : [])
          ]
        }
      ]
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: sort === "popular" 
      ? { likes: { _count: "desc" } } 
      : sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" },
  });

  const formattedForums = forums.map((forum) => ({
    ...forum,
    createdAt: forum.createdAt.toISOString(),
    tags: forum.tags.map((ft) => ft.tag.name),
  }));

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Forums
      </Typography>
      
      <SearchFilter placeholder="Search all forums..." />

      {formattedForums.length === 0 ? (
        <Typography>No forums found matching your search.</Typography>
      ) : (
        formattedForums.map((forum) => <ForumCard key={forum.id} forum={forum} />)
      )}
    </Container>
  );
}
