import { Typography, Container } from "@mui/material";
import SearchFilter from "@/components/common/SearchFilter";
import ForumFeedClient from "@/components/forum/ForumFeedClient";
import { getForumsPaginated } from "@/actions/forumActions";
export default async function ForumListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params?.q === "string" ? params.q : "";
  const sort = typeof params?.sort === "string" ? params.sort : "latest";
  const { forums, nextCursor } = await getForumsPaginated(
    undefined,
    10,
    q,
    sort,
  );
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Forums
      </Typography>
      <SearchFilter placeholder="Search all forums..." />
      <ForumFeedClient
        initialForums={forums}
        initialNextCursor={nextCursor}
        q={q}
        sort={sort}
      />
    </Container>
  );
}
