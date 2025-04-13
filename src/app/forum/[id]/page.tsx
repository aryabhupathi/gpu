"use client";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Container,
  Box,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  Card, CardContent,CardHeader,
  Paper,
  Divider,
} from "@mui/material";
import { ThumbUp } from "@mui/icons-material";
import { fetchForumById, toggleForumLike } from "@/redux/slices/forumSlice";
import {
  fetchCommentsByForumId,
  addComment,
  toggleCommentLike,
} from "@/redux/slices/commentSlice";
import { RootState } from "@/redux/store";
export default function ForumDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedForum,
    loading: forumLoading,
    error: forumError,
  } = useSelector((state: RootState) => state.forum);
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
  } = useSelector((state: RootState) => state.comment);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);=
  useEffect(() => {
    if (id) {
      dispatch(fetchForumById(id as string));
      dispatch(fetchCommentsByForumId(id as string));
    }
  }, [dispatch, id]);
  const handleLikeToggle = () => {
    if (!selectedForum) return;
    dispatch(toggleForumLike(selectedForum.id));
  };
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      dispatch(addComment({ forumId: id as string, content: newComment }));
      setNewComment("");
    }
  };
  const handleShowComments = () => {
    setShowComments(!showComments);
  };
  if (forumLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (forumError || !selectedForum) {
    return (
      <Typography align="center" color="error" sx={{ mt: 4 }}>
        Error loading forum
      </Typography>
    );
  }
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 5 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {selectedForum.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2, whiteSpace: "pre-wrap" }}
          >
            {selectedForum.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { sm: "center" },
              gap: 1,
              flexWrap: "wrap",
              mt: 2,
              mb: 3,
            }}
          >
            <Typography variant="caption" color="text.disabled">
              Posted on {new Date(selectedForum.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              By: {selectedForum.user?.name || "Unknown"}
            </Typography>
          </Box>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color={selectedForum.userLiked ? "primary" : "default"}
                onClick={handleLikeToggle}
                aria-label="like-forum"
                disabled={selectedForum.user.email === user.email}
              >
                <ThumbUp />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {selectedForum._count?.likes ?? 0} Likes
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Log in to like this post.
            </Typography>
          )}
        </Paper>
        {/* Comment Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Comments ({comments.length})
          </Typography>
          <Button onClick={handleShowComments}>
            {showComments ? "Hide comments" : "Show all comments"}
          </Button>
          {user ? (
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
              <TextField
                label="Add a comment"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={commentsLoading}
              >
                Post Comment
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Log in to post a comment.
            </Typography>
          )}
          {commentsLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {commentsError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {commentsError}
            </Typography>
          )}
          {showComments && (
            <List disablePadding>
              {comments.map((comment) => (
                <Card key={comment.id} elevation={1} sx={{ mb: 2 }}>
                  <CardHeader
                    title={comment.content}
                    subheader={
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary">
                          Commented on{" "}
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                          By: {comment.user?.name || "Anonymous"}
                        </Typography>
                      </Box>
                    }
                    sx={{ padding: 2 }}
                  />
                  <CardContent>
                    {user && (
                      <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                        <IconButton
                          color={comment.userLiked ? "primary" : "default"}
                          onClick={() => dispatch(toggleCommentLike(comment.id))}
                          aria-label="like-comment"
                          size="small"
                        >
                          <ThumbUp fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">
                          {comment._count?.likes ?? 0} Likes
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
              {!comments.length && !commentsLoading && (
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Be the first to share your thoughts!
                </Typography>
              )}
            </List>
          )}
        </Box>
      </Box>
    </Container>
  );
}
