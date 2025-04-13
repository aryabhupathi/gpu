
  "use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserForums, deleteForum } from "@/redux/slices/forumSlice";
import { fetchUserComments } from "@/redux/slices/commentSlice";
import ForumCard from "@/components/forum/ForumCard";
import {
  Container,
  Typography,
  Divider,
  Button,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid"
import Link from "next/link";
import { RootState } from "@/redux/store";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const forums = useSelector((state: RootState) => state.forum.userForums);
  const comments = useSelector((state: RootState) => state.comment.comments);
  const forumLoading = useSelector((state: RootState) => state.forum.loading);
  const commentLoading = useSelector(
    (state: RootState) => state.comment.loading
  );

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchUserForums() as any);
      dispatch(fetchUserComments() as any);
    }
  }, [session, dispatch]);


  const handleDelete = async (forumId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this forum?"
    );
    if (!confirmDelete) return;
    try {
      await dispatch(deleteForum(forumId) as any);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h6" align="center">
          Please sign in to view your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome, {session.user.name || "User"}
      </Typography>

      {/* Forums Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Your Forums
      </Typography>
        {forumLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : forums.length > 0 ? (
          <Grid container spacing={2}>
            {forums.map((forum: any) => (
              <Grid item size={{xs:12, lg:4}} key={forum.id}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <ForumCard forum={forum} />
                  <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent:"center" }}>
                    <Link href={`/forum/edit/${forum.id}`} passHref>
                      <Button variant="outlined" size="small">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(forum.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            You haven't created any forums yet.
          </Typography>
        )}

      <Divider sx={{ my: 4 }} />

      {/* Comments Section */}
      <Typography variant="h6" gutterBottom>
        Your Comments
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        {commentLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : comments.length > 0 ? (
          <Grid container spacing={2}>
            {comments.map((comment: any) => (
              <Grid item size={{xs:12, lg:4}} key={comment.id}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    On forum{" "}
                    <Link href={`/forum/${comment.forumId}`}>
                      <strong>{comment.forumTitle}</strong>
                    </Link>
                    : {comment.content}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            You haven't commented on any forums yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
