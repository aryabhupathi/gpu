import ForumCard from "@/components/forum/ForumCard";
import { Typography, Container, Box } from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import prisma from "@/lib/prisma";
import SearchFilter from "@/components/common/SearchFilter";
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params?.q === 'string' ? params.q : "";
  const sort = typeof params?.sort === "string" ? params.sort : "popular";
  const forums = await prisma.forum.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { tags: { some: { tag: { name: { contains: q } } } } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy:
      sort === "popular"
        ? { likes: { _count: "desc" } }
        : sort === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" },
    take: 20,
  });
  const formattedForums = forums.map((forum) => ({
    ...forum,
    createdAt: forum.createdAt.toISOString(),
    tags: forum.tags.map((ft) => ft.tag.name),
  }));
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <LocalFireDepartmentIcon color="error" fontSize="large" />
        <Typography variant="h4" fontWeight="bold">
          Trending
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Discover the most popular discussions happening right now.
      </Typography>
      <SearchFilter placeholder="Search trending discussions..." />
      {formattedForums.length === 0 ? (
        <Typography>No trending forums found.</Typography>
      ) : (
        formattedForums.map((forum) => (
          <ForumCard key={forum.id} forum={forum} />
        ))
      )}
    </Container>
  );
}
