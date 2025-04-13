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
  Stack,
  CircularProgress,
} from "@mui/material";
export default function EditForumPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const forum = useSelector((state: any) => state.forum.selectedForum);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      dispatch(fetchForumById(id as string));
    }
  }, [id, dispatch]);
  useEffect(() => {
    if (forum && forum.id === id) {
      setTitle(forum.title || "");
      setDescription(forum.description || "");
      const tagNames = forum.tags.join(", ") || "";
      setTags(tagNames);
      setLoading(false);
    }
  }, [forum, id]);
  const handleUpdate = async () => {
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const requestBody = {
      title: title,
      description: description,
      tags: tagsArray,
    };
    try {
      const response = await fetch(`/api/forums/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          `Update failed: ${errorDetails.error || response.statusText}`
        );
      }
      const updatedForum = await response.json();
    } catch (error) {
      console.error("Error during forum update:", error);
    }
  };
  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
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
