"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchForumById, updateForum } from "@/redux/slices/forumSlice";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack
} from "@mui/material";

export default function EditForumPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const forum = useSelector((state: any) => state.forum.currentForum);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchForumById(id as string) as any);
  }, [id, dispatch]);

  useEffect(() => {
    if (forum) {
      setTitle(forum.title);
      setDescription(forum.description);
      setTags(forum.tags?.join(",") || "");
    }
  }, [forum]);

  const handleUpdate = async () => {
    const success = await dispatch(updateForum({ id, title, description, tags: tags.split(",") }) as any);
    if (success) router.push(`/forums/${id}`);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>Edit Forum</Typography>
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
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update Forum
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
