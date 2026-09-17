"use client";
import React, { useState, useTransition } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import ForumCard from "@/components/forum/ForumCard";
import { toggleFollow } from "@/actions/followActions";
export interface PublicProfileUser {
  id: string;
  name: string | null;
  image: string | null;
  bio?: string | null;
  level?: number;
  xp?: number;
  _count: {
    followers: number;
    following: number;
    forums?: number;
  };
  forums: {
    id: string;
    title: string;
    description: string;
    createdAt: string | Date;
    user: { id: string; name: string | null };
    _count?: { likes: number; comments: number };
  }[];
  bookmarks?: {
    id: string;
    title: string;
    description: string;
    createdAt: string | Date;
    user: { id: string; name: string | null };
    _count?: { likes: number; comments: number };
  }[];
}
export default function PublicProfileClient({
  profileUser,
  isFollowing: initialIsFollowing,
  isSelf,
}: {
  profileUser: PublicProfileUser;
  isFollowing: boolean;
  isSelf: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(
    profileUser._count.followers,
  );
  const [isPending, startTransition] = useTransition();
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
    startTransition(async () => {
      try {
        const result = await toggleFollow(profileUser.id);
        setIsFollowing(result.followed);
      } catch {
        setIsFollowing(isFollowing);
        setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
      }
    });
  };
  const [tabValue, setTabValue] = useState(0);
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", mb: 4 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <Avatar
            src={profileUser.image || ""}
            sx={{
              width: 120,
              height: 120,
              fontSize: "3rem",
              bgcolor: "primary.main",
            }}
          >
            {profileUser.name?.charAt(0) || "U"}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {profileUser.name || "Anonymous User"}
            </Typography>
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              <Typography variant="body1">
                <strong>{followerCount}</strong> Followers
              </Typography>
              <Typography variant="body1">
                <strong>{profileUser._count.following}</strong> Following
              </Typography>
              <Typography variant="body1">
                <strong>{profileUser._count.forums}</strong> Posts
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip label={`Level ${profileUser.level}`} color="secondary" />
              <Chip label={`${profileUser.xp} XP`} variant="outlined" />
            </Box>
          </Box>
          {!isSelf && (
            <Box>
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                color="primary"
                onClick={handleFollowToggle}
                disabled={isPending}
                sx={{ borderRadius: 8, px: 4, fontWeight: 600 }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      {isSelf ? (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="My Posts" />
            <Tab label="Saved" />
          </Tabs>
        </Box>
      ) : (
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mb: 3, color: "text.primary" }}
        >
          Posts by {profileUser.name?.split(" ")[0] || "User"}
        </Typography>
      )}
      {tabValue === 0 &&
        (profileUser.forums.length > 0 ? (
          <Grid container spacing={3}>
            {profileUser.forums.map((forum) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={forum.id}>
                <ForumCard forum={forum} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            This user hasn&apos;t posted anything yet.
          </Typography>
        ))}
      {tabValue === 1 &&
        isSelf &&
        ((profileUser.bookmarks?.length ?? 0) > 0 ? (
          <Grid container spacing={3}>
            {profileUser.bookmarks?.map((forum) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={forum.id}>
                <ForumCard forum={forum} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            You haven&apos;t saved any posts yet.
          </Typography>
        ))}
    </Container>
  );
}
