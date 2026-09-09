import React from "react";
import { Container, Typography, Box, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function LeaderboardPage() {
  const topUsers = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      image: true,
      xp: true,
      level: true,
      badges: true
    }
  });

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom sx={{ background: "linear-gradient(90deg, #F59E0B, #EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Global Leaderboard
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
        The top 20 most active members of our community!
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <List disablePadding>
          {topUsers.map((user, index) => (
            <ListItem 
              key={user.id} 
              divider={index !== topUsers.length - 1}
              sx={{ py: 2, px: 3, "&:hover": { bgcolor: "#F8FAFC" } }}
              component={Link}
              href={`/u/${user.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Box sx={{ width: 40, fontWeight: 800, color: index < 3 ? "#F59E0B" : "text.secondary" }}>
                #{index + 1}
              </Box>
              <ListItemAvatar>
                <Avatar src={user.image || ""} sx={{ bgcolor: index === 0 ? "#F59E0B" : "primary.main" }}>
                  {user.name?.charAt(0) || "U"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography fontWeight={700}>{user.name || "Anonymous"}</Typography>}
                secondary={`Level ${user.level} • ${user.xp} XP`}
              />
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {user.badges?.split(',').filter(Boolean).slice(0, 3).map((badge, i) => (
                  <Avatar key={i} sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: 'secondary.main' }}>
                    {badge.charAt(0)}
                  </Avatar>
                ))}
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
