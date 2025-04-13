"use client";
import { CircularProgress, Container, Box } from "@mui/material";
export default function GlobalLoading() {
  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    </Container>
  );
}
