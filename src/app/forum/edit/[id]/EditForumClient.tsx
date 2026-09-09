"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateForum } from "@/actions/forumActions";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

type EditForumProps = {
  forum: {
    id: string;
    title: string;
    description: string;
    tags: { name: string }[];
  }
};

export default function EditForumClient({ forum }: EditForumProps) {
  const router = useRouter();
  const [title, setTitle] = useState(forum.title || "");
  const [description, setDescription] = useState(forum.description || "");
  const [tags, setTags] = useState(forum.tags.map((t: { name: string }) => t.name).join(", ") || "");
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async () => {
    startTransition(async () => {
      try {
        await updateForum(forum.id, { 
          title, 
          description, 
          tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean) 
        });
        router.push("/profile");
      } catch (e) {
        console.error("Failed to update forum", e);
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>
          Edit Forum
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            disabled={isPending}
          />
          <TextField
            label="Description"
            value={description}
            multiline
            minRows={4}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            disabled={isPending}
          />
          <TextField
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
            disabled={isPending}
          />
          <Button onClick={handleUpdate} variant="contained" color="primary" disabled={isPending}>
            {isPending ? "Updating..." : "Update Forum"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
