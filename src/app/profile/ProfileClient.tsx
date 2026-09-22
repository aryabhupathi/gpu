"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Divider,
  Button
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import ForumCard from "@/components/forum/ForumCard";
import ProfileDeleteButton from "./ProfileDeleteButton";
import { calculateLevel, getXpForNextLevel, getLevelName } from "@/lib/gamification";
import LinearProgress from "@mui/material/LinearProgress";
export interface ProfileUser {
  id: string;
  name: string | null;
  email?: string | null;
  phone?: string | null;
  image: string | null;
  bio?: string | null;
  xp: number;
  role?: string;
  createdAt?: string | Date;
  following?: {
    following: { id: string; name: string | null; image: string | null };
  }[];
  followers?: {
    follower: { id: string; name: string | null; image: string | null };
  }[];
}
export interface ProfileForum {
  id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  isPrivate?: boolean;
  tags?: string[];
  user: {
    id: string;
    name: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}
export interface ProfileComment {
  id: string;
  content: string;
  createdAt: string | Date;
  forumId: string;
  forum?: { id: string; title: string };
  _count?: { likes: number };
}
interface ProfileClientProps {
  user: ProfileUser;
  forums: ProfileForum[];
  comments: ProfileComment[];
  likedForums: { forum: ProfileForum }[];
}
export default function ProfileClient({ user, forums, comments, likedForums }: ProfileClientProps) {
  const [tab, setTab] = useState(0);
  const xp = user.xp || 0;
  const level = calculateLevel(xp);
  const nextXp = getXpForNextLevel(xp);
  const levelName = getLevelName(level);
  const progressPercent = nextXp
    ? Math.min(100, Math.max(0, (xp / nextXp) * 100))
    : 100;
  const isPremium = level >= 4;
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          bgcolor: isPremium ? "#1E293B" : "#fff",
          color: isPremium ? "#F8FAFC" : "inherit",
          border: isPremium ? "2px solid #7C3AED" : "1px solid #E5E7EB",
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isPremium && (
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
            }}
          />
        )}
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: isPremium ? "secondary.main" : "primary.main",
            fontSize: "3rem",
            fontWeight: "bold",
            boxShadow: isPremium ? "0 0 20px rgba(124, 58, 237, 0.6)" : "none",
            border: isPremium ? "4px solid #7C3AED" : "none",
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Avatar>
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            color={isPremium ? "#fff" : "#1F2937"}
            gutterBottom
          >
            {user.name} {isPremium && "🌟"}
          </Typography>
          <Typography
            variant="body1"
            color={isPremium ? "#94A3B8" : "text.secondary"}
            sx={{ mb: 2 }}
          >
            {user.email}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: isPremium ? "rgba(124, 58, 237, 0.2)" : "primary.50",
                color: isPremium ? "#A78BFA" : "primary.main",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 700,
                border: isPremium
                  ? "1px solid rgba(124, 58, 237, 0.5)"
                  : "none",
              }}
            >
              Level {level} - {levelName}
            </Box>
            <Typography
              variant="body2"
              color={isPremium ? "#CBD5E1" : "text.secondary"}
              fontWeight={600}
            >
              {xp} XP
            </Typography>
          </Box>
          <Box sx={{ width: "100%", maxWidth: 400, mx: { xs: "auto", sm: 0 } }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography
                variant="caption"
                color={isPremium ? "#94A3B8" : "text.secondary"}
              >
                Progress to next level
              </Typography>
              <Typography
                variant="caption"
                color={isPremium ? "#94A3B8" : "text.secondary"}
              >
                {nextXp ? `${xp} / ${nextXp} XP` : "Max Level"}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: isPremium ? "rgba(255,255,255,0.1)" : "#E2E8F0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  backgroundImage:
                    "linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)",
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          aria-label="profile tabs"
        >
          <Tab
            label={`My Discussions (${forums.length})`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
          <Tab
            label={`My Comments (${comments.length})`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
          <Tab
            label={`Liked Posts (${likedForums.length})`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
          <Tab
            label={`Followers (${user.followers?.length || 0})`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
          <Tab
            label={`Following (${user.following?.length || 0})`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
        </Tabs>
      </Box>
      {tab === 0 && (
        <Box>
          {forums.length > 0 ? (
            <Grid container spacing={3}>
              {forums.map((forum) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={forum.id}>
                  <Box sx={{ position: "relative", height: "100%" }}>
                    <ForumCard forum={forum} />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Link href={`/forum/edit/${forum.id}`} passHref>
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
                          sx={{ minWidth: "auto", px: 1, py: 0.5 }}
                        >
                          Edit
                        </Button>
                      </Link>
                      <ProfileDeleteButton forumId={forum.id} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "#F8FAFC",
                border: "1px dashed #CBD5E1",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                You haven&apos;t started any discussions yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      {tab === 1 && (
        <Box>
          {comments.length > 0 ? (
            <Grid container spacing={3}>
              {comments.map((comment) => (
                <Grid size={{ xs: 12, md: 6 }} key={comment.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      border: "1px solid #E5E7EB",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Commented on:{" "}
                      <Link
                        href={`/forum/${comment.forumId}`}
                        style={{
                          color: "#7C3AED",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        {comment?.forum?.title}
                      </Link>
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ flexGrow: 1, mb: 2, whiteSpace: "pre-wrap" }}
                    >
                      {comment.content}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.disabled">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                        )}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="primary.main"
                        fontWeight={600}
                      >
                        {comment._count?.likes || 0} Likes
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "#F8FAFC",
                border: "1px dashed #CBD5E1",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                You haven&apos;t commented on anything yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      {tab === 2 && (
        <Box>
          {likedForums.length > 0 ? (
            <Grid container spacing={3}>
              {likedForums.map((like) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={like.forum.id}>
                  <ForumCard forum={like.forum} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "#F8FAFC",
                border: "1px dashed #CBD5E1",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                You haven&apos;t liked any discussions yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      {tab === 3 && (
        <Box>
          {user.followers && user.followers.length > 0 ? (
            <Grid container spacing={2}>
              {user.followers.map((f) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.follower.id}>
                  <Link href={`/u/${f.follower.id}`} style={{ textDecoration: 'none' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 3,
                        border: '1px solid #E5E7EB',
                        '&:hover': {
                          borderColor: '#7C3AED',
                          bgcolor: 'rgba(124, 58, 237, 0.02)',
                        }
                      }}
                    >
                      <Avatar src={f.follower.image || ""} sx={{ width: 48, height: 48 }}>
                        {f.follower.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        {f.follower.name || "Unknown"}
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
              <Typography variant="body1" color="text.secondary">
                You don't have any followers yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      {tab === 4 && (
        <Box>
          {user.following && user.following.length > 0 ? (
            <Grid container spacing={2}>
              {user.following.map((f) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.following.id}>
                  <Link href={`/u/${f.following.id}`} style={{ textDecoration: 'none' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 3,
                        border: '1px solid #E5E7EB',
                        '&:hover': {
                          borderColor: '#7C3AED',
                          bgcolor: 'rgba(124, 58, 237, 0.02)',
                        }
                      }}
                    >
                      <Avatar src={f.following.image || ""} sx={{ width: 48, height: 48 }}>
                        {f.following.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        {f.following.name || "Unknown"}
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
              <Typography variant="body1" color="text.secondary">
                You aren't following anyone yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Container>
  );
}
