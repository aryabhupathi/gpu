import React from 'react';
import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminPanel from '@/components/admin/AdminPanel';
import UserSettings from '@/components/settings/UserSettings';
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN";

  let users: any[] = [];
  if (isAdmin) {
    const rawUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    // Serialize dates for Client Component
    users = rawUsers.map(u => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }));
  }

  const userInDb = await prisma.user.findUnique({ where: { email: session.user.email! } });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h4" gutterBottom>Settings</Typography>
        
        {isAdmin ? (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Administrator Moderation Panel. Manage users, enforce bans, and issue warnings.
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <AdminPanel users={users} />
          </>
        ) : (
          <UserSettings user={{ name: session.user.name || "", email: session.user.email || "", image: userInDb?.image }} />
        )}
      </Box>
    </Container>
  );
}
