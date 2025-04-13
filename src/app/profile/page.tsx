"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
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
} from "@mui/material";
import Link from "next/link";
import { RootState } from "@/redux/store";
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
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
  console.log(forums, "forums");
  console.log(comments, "comments");
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
    return <Typography>Please sign in to view your profile.</Typography>;
  }
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Your Profile
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Forums
      </Typography>
      {forumLoading ? (
        <CircularProgress />
      ) : forums.length > 0 ? (
        forums.map((forum: any) => (
          <Box key={forum.id} sx={{ mb: 2 }}>
            <ForumCard forum={forum} />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
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
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          You haven't created any forums yet.
        </Typography>
      )}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" gutterBottom>
        Your Comments
      </Typography>
      {commentLoading ? (
        <CircularProgress />
      ) : comments.length > 0 ? (
        comments.map((comment: any) => (
          <Box key={comment.id} sx={{ mb: 2 }}>
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
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          You haven't commented on any forums yet.
        </Typography>
      )}
    </Container>
  );
}
