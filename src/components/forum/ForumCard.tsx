"use client";
import React from "react";
import { Card, Typography, Box, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
interface ForumCardProps {
  forum: {
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
  };
}
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
export default function ForumCard({ forum }: ForumCardProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/forum/${forum.id}`);
  };
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <Card
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid #E2E8F0",
          "&:hover": {
            boxShadow: "0 12px 24px -10px rgba(124, 58, 237, 0.3)",
            borderColor: "primary.light",
          },
          display: "flex",
          marginTop: "10px",
          flexDirection: "column",
          height: "100%",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {forum.tags &&
            forum.tags.map((tag) => (
              <Typography
                key={tag}
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  bgcolor: "primary.50",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.65rem",
                }}
              >
                #{tag}
              </Typography>
            ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          {forum.isPrivate && (
            <LockIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />
          )}
          <Typography
            variant="h6"
            fontWeight="800"
            sx={{ lineHeight: 1.3, flexGrow: 1, color: "text.primary" }}
          >
            {forum.title}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.6,
          }}
        >
          {forum.description.replace(/<[^>]+>/g, "")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/u/${forum.user.id}`);
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "secondary.main",
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
            >
              {forum.user?.name ? forum.user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
              >
                {forum.user?.name || "Unknown User"}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {new Date(forum.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                bgcolor: "rgba(59, 130, 246, 0.1)",
                color: "#3B82F6",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(59, 130, 246, 0.2)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: "1.1rem" }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {forum._count?.comments || 0}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                bgcolor: "rgba(244, 63, 94, 0.1)",
                color: "#F43F5E",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(244, 63, 94, 0.2)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <FavoriteBorderIcon sx={{ fontSize: "1.1rem" }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {forum._count?.likes || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
}
