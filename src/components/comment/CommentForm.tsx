import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchForumById, clearCurrentForum } from "@/redux/slices/forumSlice";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import axios from "axios";
import Head from "next/head";
import CommentList from "@/components/comment/CommentList";
import CommentForm from "@/components/comment/CommentForm";
export default function ForumDetail() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { currentForum, loading, error } = useSelector(
    (state: RootState) => state.forum
  );
  const [likeStatus, setLikeStatus] = React.useState({
    liked: false,
    count: 0,
    loading: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchForumById(id));
    }
    return () => {
      dispatch(clearCurrentForum());
    };
  }, [dispatch, id]);
  useEffect(() => {
    if (currentForum) {
      setLikeStatus({
        liked: currentForum.userLiked || false,
        count: currentForum._count?.likes || 0,
        loading: false,
      });
    }
  }, [currentForum]);
  const handleLikeToggle = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (!id || typeof id !== "string") return;
    setLikeStatus((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axios.post(`/api/forums/${id}/like`);
      const { liked } = response.data;
      setLikeStatus((prev) => ({
        liked,
        count: liked ? prev.count + 1 : prev.count - 1,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setLikeStatus((prev) => ({ ...prev, loading: false }));
    }
  };
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!id || typeof id !== "string") return;
    try {
      await axios.delete(`/api/forums/${id}`);
      setDeleteDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Failed to delete forum:", error);
      setDeleteDialogOpen(false);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }
  if (!currentForum) {
    return (
      <Typography align="center" sx={{ my: 4 }}>
        Forum not found
      </Typography>
    );
  }
  const isOwner = session?.user?.id === currentForum.user.id;
  return (
    <>
      <Head>
        <title>{currentForum.title} | Community Forums</title>
      </Head>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {currentForum.title}
            </Typography>
            {isOwner && (
              <Box>
                <IconButton
                  color="primary"
                  component="a"
                  href={`/forums/edit/${currentForum.id}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={handleDeleteClick}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              alt={currentForum.user.name || "User"}
              src={currentForum.user.image || ""}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              Posted by {currentForum.user.name} ·{" "}
              {formatDistanceToNow(new Date(currentForum.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {currentForum.tags.map(({ tag }) => (
              <Chip key={tag.id} label={tag.name} size="small" />
            ))}
          </Box>
          <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-wrap" }}>
            {currentForum.description}
          </Typography>
          <Button
            startIcon={<ThumbUpIcon />}
            variant={likeStatus.liked ? "contained" : "outlined"}
            color="primary"
            onClick={handleLikeToggle}
            disabled={likeStatus.loading}
            sx={{ mt: 2 }}
          >
            {likeStatus.liked ? "Liked" : "Like"} ({likeStatus.count})
          </Button>
        </Box>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          Comments
        </Typography>
        {session ? (
          <CommentForm forumId={currentForum.id} />
        ) : (
          <Typography sx={{ my: 2 }}>
            Please{" "}
            <Button component="a" href="/auth/signin">
              sign in
            </Button>{" "}
            to add a comment.
          </Typography>
        )}
        <CommentList comments={currentForum.comments} />
      </Container>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Forum</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this forum? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
