import React from "react";
import { Typography, Container, Grid, Paper } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }
  const totalUsers = await prisma.user.count();
  const totalForums = await prisma.forum.count();
  const totalComments = await prisma.comment.count();
  const totalTags = await prisma.tag.count();
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome, {session.user.name}. Here&apos;s an overview of the platform.
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" fontWeight="bold" color="primary">
              {totalUsers}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Users
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" fontWeight="bold" color="secondary">
              {totalForums}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Forums
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" fontWeight="bold" color="success.main">
              {totalComments}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Comments
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" fontWeight="bold" color="warning.main">
              {totalTags}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Tags
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
