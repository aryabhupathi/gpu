import React from "react";
import { Box, Typography, Button, Container, Grid, Paper } from "@mui/material";
import Link from "next/link";
import ForumIcon from "@mui/icons-material/Forum";
import GroupIcon from "@mui/icons-material/Group";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          color: "white",
          py: 12,
          textAlign: "center",
          borderRadius: 4,
          mb: 8,
          mt: 4,
          mx: 2,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to LetsTalk
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, color: "#94A3B8" }}
          >
            The ultimate community platform to connect, share, and explore
            topics you care about.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              component={Link}
              href="/forum"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#3B82F6",
                "&:hover": { bgcolor: "#2563EB" },
                px: 4,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Browse Forums
            </Button>
            <Button
              component={Link}
              href="/auth/signup"
              variant="outlined"
              size="large"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.2)",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.05)",
                },
                px: 4,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Join Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Join LetsTalk?
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                height: "100%",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <ForumIcon sx={{ fontSize: 60, color: "#3B82F6", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Engaging Discussions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dive into deep conversations on topics you love. Create forums
                and interact with posts instantly.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                height: "100%",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <GroupIcon sx={{ fontSize: 60, color: "#10B981", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Vibrant Community
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with thousands of like-minded individuals. Build your
                profile and grow your network.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                height: "100%",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 60, color: "#F59E0B", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Trending Topics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stay updated with the latest trends and popular spaces tailored
                to your interests.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
