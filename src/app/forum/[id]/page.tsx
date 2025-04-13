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
  if (forumLoading) return <CircularProgress />;
  if (forumError || !selectedForum)
    return <Typography>Error loading forum</Typography>;
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          {selectedForum.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {selectedForum.description}
        </Typography>
        <Typography variant="caption" color="text.disabled" gutterBottom>
          Posted on {new Date(selectedForum.createdAt).toLocaleString()}
        </Typography>
        {user ? (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <IconButton
              color={selectedForum.userLiked ? "primary" : "default"} // Highlight the icon if liked
              onClick={handleLikeToggle}
              aria-label="like-comment"
              size="small"
              disabled={selectedForum.user.email === user.email} // Disable the like button if the user is the forum author
            >
              <ThumbUp fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {selectedForum._count?.likes ?? 0} Likes
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Log in to like this post.
          </Typography>
        )}
        {/* Comment Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          {user ? (
            <form onSubmit={handleCommentSubmit}>
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
                color="primary"
                disabled={commentsLoading}
                sx={{ mb: 2 }}
              >
                Post Comment
              </Button>
            </form>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Log in to post a comment.
            </Typography>
          )}
          {commentsLoading && <CircularProgress />}
          {commentsError && (
            <Typography color="error">{commentsError}</Typography>
          )}
          {/* Comments List */}
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id} sx={{ display: "block", mb: 2 }}>
                <Typography variant="body2">{comment.content}</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  — {comment.user?.email || "Anonymous"}
                </Typography>
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
                    <Typography
                      variant="caption"
                      sx={{ ml: 1 }}
                      color="text.secondary"
                    >
                      {comment._count?.likes ?? 0} Likes
                    </Typography>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Container>
  );
}
