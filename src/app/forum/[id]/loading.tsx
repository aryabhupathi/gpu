import { Container, Skeleton, Box, Paper, Typography } from "@mui/material";
export default function LoadingForumDetail() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ mb: 2, borderRadius: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="20%" />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Skeleton variant="text" width="10%" />
        </Box>
      </Paper>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          <Skeleton width="30%" />
        </Typography>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={120}
          sx={{ mb: 4, borderRadius: 2 }}
        />
        {[1, 2, 3].map((i) => (
          <Paper
            key={i}
            sx={{ p: 3, mb: 2, borderRadius: 3, display: "flex", gap: 2 }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="20%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
