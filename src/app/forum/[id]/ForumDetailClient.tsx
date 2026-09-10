"use client";

import { useState, useTransition } from "react";
import {
  Typography,
  Container,
  Box,
  IconButton,
  TextField,
  Button,
  List,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ThumbUp, BookmarkBorder, Bookmark, Share as ShareIcon } from "@mui/icons-material";
import { toggleForumLike, archiveForum, deleteForum } from "@/actions/forumActions";
import { toggleBookmark } from "@/actions/bookmarkActions";
import { addComment, toggleCommentLike } from "@/actions/commentActions";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import LinkPreview from "@/components/common/LinkPreview";

type ForumType = {
  id: string;
  title: string;
  description: string;
  mediaUrl: string | null;
  createdAt: Date;
  archived: boolean;
  userLiked: boolean;
  userBookmarked?: boolean;
  user: { id: string; name: string | null; email: string | null };
  _count: { likes: number };
};

type CommentType = {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  userLiked: boolean;
  user: { name: string | null; email: string | null };
  _count: { likes: number };
};

export default function ForumDetailClient({
  forum,
  initialComments,
  user,
}: {
  forum: ForumType;
  initialComments: CommentType[];
  user: { email?: string | null; name?: string | null; role?: string | null } | null | undefined;
}) {
  const [comments, setComments] = useState(initialComments);
  const [forumData, setForumData] = useState(forum);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLikeToggle = () => {
    if (!forumData) return;

    // Optimistic update
    const wasLiked = forumData.userLiked;
    setForumData({
      ...forumData,
      userLiked: !wasLiked,
      _count: {
        likes: wasLiked
          ? forumData._count.likes - 1
          : forumData._count.likes + 1,
      },
    });

    startTransition(async () => {
      try {
        const { liked, likeCount } = await toggleForumLike(forumData.id);
        setForumData((prev: ForumType) => ({
          ...prev,
          userLiked: liked,
          _count: { likes: likeCount },
        }));
      } catch {
        // Revert on error
        setForumData({
          ...forumData,
          userLiked: wasLiked,
          _count: {
            likes: wasLiked
              ? forumData._count.likes - 1
              : forumData._count.likes + 1,
          },
        });
      }
    });
  };

  const handleBookmarkToggle = () => {
    if (!forumData) return;
    const wasBookmarked = forumData.userBookmarked;
    
    setForumData({
      ...forumData,
      userBookmarked: !wasBookmarked
    });

    startTransition(async () => {
      try {
        const { bookmarked } = await toggleBookmark(forumData.id);
        setForumData((prev) => ({ ...prev, userBookmarked: bookmarked }));
      } catch (err) {
        setForumData((prev) => ({ ...prev, userBookmarked: wasBookmarked }));
      }
    });
  };

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: forumData.title,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setSnackbarOpen(true);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const content = newComment;
      setNewComment("");
      startTransition(async () => {
        try {
          await addComment(forumData.id, content);
        } catch (error) {
          console.error(error);
        }
      });
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (replyContent.trim()) {
      const content = replyContent;
      setReplyContent("");
      setReplyingTo(null);
      startTransition(async () => {
        try {
          await addComment(forumData.id, content, parentId);
        } catch (error) {
          console.error(error);
        }
      });
    }
  };

  const handleCommentLikeToggle = (
    commentId: string,
    currentlyLiked: boolean,
    currentCount: number,
  ) => {
    // Optimistic
    setComments((prev: CommentType[]) =>
      prev.map((c: CommentType) =>
        c.id === commentId
          ? {
              ...c,
              userLiked: !currentlyLiked,
              _count: {
                likes: currentlyLiked ? currentCount - 1 : currentCount + 1,
              },
            }
          : c,
      ),
    );

    startTransition(async () => {
      try {
        const { liked, likeCount } = await toggleCommentLike(commentId);
        setComments((prev: CommentType[]) =>
          prev.map((c: CommentType) =>
            c.id === commentId
              ? { ...c, userLiked: liked, _count: { likes: likeCount } }
              : c,
          ),
        );
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  const handleArchive = () => {
    startTransition(async () => {
      try {
        await archiveForum(forumData.id);
        setForumData(prev => ({ ...prev, archived: !prev.archived }));
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this forum?")) {
      startTransition(async () => {
        try {
          await deleteForum(forumData.id);
          window.location.href = "/forum";
        } catch (err) {
          console.error(err);
        }
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 4,
              background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{
                background: "linear-gradient(90deg, #7C3AED, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {forumData.title}
              {forumData.archived && (
                <Box component="span" sx={{ fontSize: '0.9rem', color: '#EF4444', border: '1px solid #EF4444', px: 1, py: 0.5, borderRadius: 1, textTransform: 'uppercase' }}>
                  Archived
                </Box>
              )}
            </Typography>

            <Box
              className="ProseMirror"
              sx={{
                mb: 4,
                "& img": { maxWidth: "100%", height: "auto", borderRadius: 2 },
                "& p": { margin: "0 0 1em", lineHeight: 1.8, color: "#334155" },
                "& h1, & h2, & h3": { margin: "1em 0 0.5em", color: "#0F172A" },
                "& ul, & ol": { paddingLeft: "1.5rem", mb: 2 },
                "& a": { color: "#3B82F6", textDecoration: "underline" },
                "& code": { bgcolor: "#F1F5F9", p: 0.5, borderRadius: 1, fontFamily: "monospace" },
                "& pre": { bgcolor: "#0F172A", color: "#F8FAFC", p: 2, borderRadius: 2, fontFamily: "monospace", overflowX: "auto" }
              }}
            >
              {parse(forumData.description, {
                replace: (domNode) => {
                  if (domNode.type === 'tag' && domNode.name === 'a') {
                    const href = domNode.attribs.href;
                    // If the link text is the exact same as the href, it's a bare link
                    const isBareUrl = domNode.children[0]?.type === 'text' && domNode.children[0].data === href;
                    if (isBareUrl) {
                      return <LinkPreview url={href} />;
                    }
                  }
                }
              })}
            </Box>

            {forumData.mediaUrl && (
              <Box sx={{ mb: 4, width: "100%", display: "flex", justifyContent: "center" }}>
                {forumData.mediaUrl.endsWith(".mp4") ? (
                  <video src={forumData.mediaUrl} controls autoPlay loop muted playsInline style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                ) : (
                  <img src={forumData.mediaUrl} alt="Forum Media" style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                )}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { sm: "center" },
                gap: 2,
                flexWrap: "wrap",
                mt: 2,
                pt: 2,
                borderTop: "1px solid #E2E8F0",
              }}
            >
              <Box 
                sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                onClick={() => router.push(`/u/${forumData.user.id}`)}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                  {forumData.user?.name?.charAt(0) || "U"}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight={600}
                  >
                    {forumData.user?.name || "Unknown"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(forumData.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
              </Box>

              {user ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {user.role === "ADMIN" && (
                    <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                      <Button size="small" variant="outlined" color="warning" onClick={handleArchive} disabled={isPending}>
                        {forumData.archived ? "Unarchive" : "Archive"}
                      </Button>
                      <Button size="small" variant="contained" color="error" onClick={handleDelete} disabled={isPending}>
                        Delete
                      </Button>
                    </Box>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      onClick={handleLikeToggle}
                      disabled={
                        forumData.user.email === user.email || isPending
                      }
                      sx={{
                        bgcolor: forumData.userLiked
                          ? "rgba(124,58,237,0.1)"
                          : "transparent",
                        color: forumData.userLiked
                          ? "#7C3AED"
                          : "text.secondary",
                      }}
                    >
                      <ThumbUp />
                    </IconButton>
                  </motion.div>
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      mr: 2,
                      fontWeight: 600,
                      color: forumData.userLiked ? "#7C3AED" : "text.secondary",
                    }}
                  >
                    {forumData._count?.likes ?? 0} Likes
                  </Typography>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      onClick={handleBookmarkToggle}
                      disabled={isPending}
                      sx={{
                        bgcolor: forumData.userBookmarked
                          ? "rgba(16, 185, 129, 0.1)"
                          : "transparent",
                        color: forumData.userBookmarked
                          ? "#10B981"
                          : "text.secondary",
                      }}
                    >
                      {forumData.userBookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      onClick={handleShare}
                      sx={{ color: "text.secondary" }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </motion.div>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Log in to like this post.
                  </Typography>
                  <IconButton onClick={handleShare} sx={{ color: "text.secondary" }}>
                    <ShareIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Paper>
        </motion.div>

        {/* Comment Section */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Comments
            <Box
              component="span"
              sx={{
                bgcolor: "#F1F5F9",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontSize: "1rem",
                color: "#64748B",
              }}
            >
              {initialComments.length}
            </Box>
          </Typography>

          <Button onClick={handleShowComments} sx={{ mb: 4, fontWeight: 600 }}>
            {showComments ? "Hide comments" : "View all discussions"}
          </Button>

          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Box
                component="form"
                onSubmit={handleCommentSubmit}
                sx={{ mb: 6, position: "relative" }}
              >
                <TextField
                  placeholder="Share your thoughts..."
                  fullWidth
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  multiline
                  minRows={3}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "#fff",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 4px rgba(124,58,237,0.1)",
                      },
                    },
                  }}
                  disabled={isPending}
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ display: "inline-block" }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending || !newComment.trim()}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1,
                      color: "#fff",
                      background:
                        "linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)",
                      fontWeight: 600,
                      boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(124,58,237,0.4)",
                      },
                      "&.Mui-disabled": {
                        color: "#ffffff",
                        opacity: 0.6,
                        boxShadow: "none",
                      }
                    }}
                  >
                    Post Reply
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 4,
                p: 3,
                bgcolor: "#F8FAFC",
                borderRadius: 3,
                textAlign: "center",
              }}
            >
              Please log in to join the discussion.
            </Typography>
          )}

          {showComments && (
            <List disablePadding>
              {(() => {
                const topLevelComments = comments.filter(c => !c.parentId);
                const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

                const renderComment = (comment: CommentType, level: number = 0) => {
                  const replies = getReplies(comment.id);
                  return (
                    <Box key={comment.id} sx={{ ml: level > 0 ? { xs: 2, sm: 6 } : 0 }}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          elevation={0}
                          sx={{
                            mb: 2,
                            borderRadius: 3,
                            border: "1px solid #E2E8F0",
                            background: comment.userLiked
                              ? "linear-gradient(to right, rgba(124,58,237,0.03), transparent)"
                              : "#fff",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                              borderColor: "#CBD5E1",
                            },
                          }}
                        >
                          <CardHeader
                            avatar={
                              <Avatar sx={{ bgcolor: "secondary.main", width: 40, height: 40, fontWeight: 700 }}>
                                {comment.user?.name?.charAt(0) || "A"}
                              </Avatar>
                            }
                            title={
                              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                {comment.user?.name || "Anonymous"}
                              </Typography>
                            }
                            subheader={
                              <Typography variant="caption" color="text.disabled">
                                {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </Typography>
                            }
                            sx={{ padding: "16px 16px 8px" }}
                          />
                          <CardContent sx={{ pt: 0, pb: "16px !important", pl: "72px" }}>
                            <Typography variant="body1" sx={{ color: "#334155", whiteSpace: "pre-wrap", mb: 2 }}>
                              {comment.content}
                            </Typography>

                            {user && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                                    <IconButton
                                      onClick={() => handleCommentLikeToggle(comment.id, comment.userLiked, comment._count?.likes ?? 0)}
                                      size="small"
                                      disabled={isPending}
                                      sx={{ color: comment.userLiked ? "#F43F5E" : "text.secondary", bgcolor: comment.userLiked ? "rgba(244,63,94,0.1)" : "transparent" }}
                                    >
                                      <ThumbUp fontSize="small" />
                                    </IconButton>
                                  </motion.div>
                                  <Typography variant="caption" fontWeight={600} color={comment.userLiked ? "#F43F5E" : "text.secondary"}>
                                    {comment._count?.likes ?? 0} Likes
                                  </Typography>
                                </Box>
                                <Button size="small" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                                  Reply
                                </Button>
                              </Box>
                            )}

                            {replyingTo === comment.id && (
                              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <TextField
                                  size="small"
                                  fullWidth
                                  placeholder="Write a reply..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  autoFocus
                                  disabled={isPending}
                                />
                                <Button variant="contained" disabled={isPending || !replyContent.trim()} onClick={() => handleReplySubmit(comment.id)}>
                                  Post
                                </Button>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                      {replies.map(reply => renderComment(reply, level + 1))}
                    </Box>
                  );
                };

                return topLevelComments.length > 0 
                  ? topLevelComments.map(c => renderComment(c))
                  : (
                    <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px dashed #CBD5E1", bgcolor: "#F8FAFC" }}>
                      <Typography variant="body1" color="text.secondary">No comments yet. Be the first to share your thoughts!</Typography>
                    </Paper>
                  );
              })()}
            </List>
          )}
        </Box>
      </Box>
      {/* Share Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
}
