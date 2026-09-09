import { Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
export default function NotFoundPage() {
  const router = useRouter();
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography gutterBottom>
        The page you&apos;re looking for doesn&apos;t exist.
      </Typography>
      <Button variant="contained" onClick={() => router.push("/")}>
        Return Home
      </Button>
    </Container>
  );
}
