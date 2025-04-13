"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button } from "@mui/material";
export default function GlobalError({ error }: { error: Error }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Container>
      <Typography variant="h4" color="error" gutterBottom>
        Something went wrong!
      </Typography>
      <Typography>{error.message}</Typography>
      <Button variant="contained" onClick={() => router.push("/")}>
        Go Home
      </Button>
    </Container>
  );
}
