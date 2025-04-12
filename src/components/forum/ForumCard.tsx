import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Link from "next/link";
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
  };
}
export default function ForumCard({ forum }: ForumCardProps) {
  return (
    <Link href={`/forum/${forum.id}`} passHref>
      <Card
        variant="outlined"
        sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {forum.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            {forum.description}
          </Typography>
          <Typography variant="caption" color="text.disabled">
      By: {forum.user?.name || "Unknown"}
    </Typography>
          <Typography variant="caption" color="text.disabled">
            Created at: {new Date(forum.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
