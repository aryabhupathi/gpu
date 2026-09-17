import { Container, Skeleton, Box, Typography, Paper } from "@mui/material";
export default function LoadingForumList() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Skeleton width="40%" />
      </Typography>
      {[1, 2, 3, 4].map((i) => (
        <Paper
          key={i}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="80%" height={24} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="circular" width={30} height={30} />
              <Skeleton variant="circular" width={30} height={30} />
            </Box>
            <Skeleton variant="text" width="20%" />
          </Box>
        </Paper>
      ))}
    </Container>
  );
}
