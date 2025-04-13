import ForumCard from "@/components/forum/ForumCard";
import { Typography, Container } from "@mui/material";
async function getForums() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/forums`, {
    cache: "no-store",
  });
  return res.json();
}
export default async function ForumListPage() {
  const forums = await getForums();
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Forums
      </Typography>
      {forums.length === 0 ? (
        <Typography>No forums yet. Create one!</Typography>
      ) : (
        forums.map((forum: any) => <ForumCard key={forum.id} forum={forum} />)
      )}
    </Container>
  );
}
