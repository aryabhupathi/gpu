
"use client";

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface ForumCardProps {
  forum: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    tags?: string[];
    user: {
      id: string;
      name: string;
    };
    _count?: {
      likes: number;
      comments: number;
    };
  };
}


export default function ForumCard({ forum }: ForumCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/forum/${forum.id}`);
  };

  return (
    <Card
      variant="outlined"
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "scale(1.01)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {forum.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {forum.description}
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block">
          By: {forum.user?.name || "Unknown"}
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block">
          Created at: {new Date(forum.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block">
          Comments: ({forum._count?.comments || 0})
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block">
          Likes: ({forum._count?.likes || 0})
        </Typography>
      </CardContent>
    </Card>
  );
}
