"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createForum } from "@/redux/slices/forumSlice";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";
export default function CreateForumPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const handleSubmit = async () => {
    const success = await dispatch(
      createForum({ title, description, tags: tags.split(",") }) as any
    );
    if (success) router.push("/");
  };
  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>
          Create New Forum
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            multiline
            minRows={4}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <TextField
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
          />
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create Forum
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
