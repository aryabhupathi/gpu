import ForumCard from "@/components/forum/ForumCard";
import { Typography, Container } from "@mui/material";
import prisma from "@/lib/prisma";
import SearchFilter from "@/components/common/SearchFilter";

export default async function GamingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params?.q === 'string' ? params.q : "";
  const sort = typeof params?.sort === 'string' ? params.sort : "latest";

  const forums = await prisma.forum.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: { in: ['gaming', 'games', 'esports'] }
          }
        }
      },
      ...(q ? {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } }
        ]
      } : {})
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
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
        Gaming
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Talk about video games, esports, board games, and everything gaming.
      </Typography>

      <SearchFilter placeholder="Search gaming forums..." />

      {formattedForums.length === 0 ? (
        <Typography>No forums found in Gaming space.</Typography>
      ) : (
        formattedForums.map((forum) => <ForumCard key={forum.id} forum={forum} />)
      )}
    </Container>
  );
}
