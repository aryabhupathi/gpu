// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { fetchForumById, deleteForum, setForumLikeStatus } from '@/redux/slices/forumSlice';
// import { fetchCommentsByForumId, addComment, deleteComment } from '@/redux/slices/commentSlice';
// import {
//   Box,
//   Button,
//   Container,
//   Typography,
//   Paper,
//   Divider,
//   Avatar,
//   TextField,
//   CircularProgress,
//   Alert,
//   Chip,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   IconButton,
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   ThumbUp as ThumbUpIcon,
//   ThumbUpOutlined as ThumbUpOutlinedIcon,
//   Send as SendIcon,
// } from '@mui/icons-material';
// import Link from 'next/link';
// import { formatDate } from '@/lib/utils';
// import CommentList from '@/components/comment/CommentList';
// import axios from 'axios';

// export default function ForumDetailPage() {
//   const { id } = useParams() as { id: string };
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const { data: session } = useSession();
//   const { currentForum, loading: forumLoading, error: forumError } = useSelector((state: RootState) => state.forum);
//   const { comments, loading: commentsLoading } = useSelector((state: RootState) => state.comment);
  
//   const [commentContent, setCommentContent] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

//   useEffect(() => {
//     dispatch(fetchForumById(id));
//     dispatch(fetchCommentsByForumId(id));
//   }, [dispatch, id]);

//   const handleAddComment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     if (!commentContent.trim()) {
//       setError('Comment cannot be empty');
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       await dispatch(addComment({ forumId: id, content: commentContent }));
//       setCommentContent('');
//     } catch (err) {
//       setError('Failed to add comment');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     await dispatch(deleteComment(commentId));
//   };

//   const handleDeleteForum = async () => {
//     await dispatch(deleteForum(id));
//     router.push('/');
//   };

//   const handleLikeToggle = async () => {
//     if (!session) return;
    
//     try {
//       const isLiked = currentForum?.userLiked;
//       const method = isLiked ? 'delete' : 'post';
//       await axios[method](`/api/forums/${id}/like`);
//       dispatch(setForumLikeStatus({ forumId: id, liked: !isLiked }));
//     } catch (error) {
//       console.error('Failed to toggle like', error);
//     }
//   };

//   if (forumLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (forumError || !currentForum) {
//     return (
//       <Container maxWidth="md" sx={{ my: 4 }}>
//         <Alert severity="error">
//           {forumError || 'Forum not found'}
//         </Alert>
//       </Container>
//     );
//   }

//   const isAuthor = session?.user?.id === currentForum.userId;

//   return (
//     <Container maxWidth="md">
//       <Paper sx={{ p: 4, my: 4 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//           <Typography variant="h4" component="h1">
//             {currentForum.title}
//           </Typography>
          
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             {isAuthor && (
//               <>
//                 <Button
//                   component={Link}
//                   href={`/forums/${id}/edit`}
//                   startIcon={<EditIcon />}
//                   variant="outlined"
//                   size="small"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   onClick={() => setOpenDeleteDialog(true)}
//                   startIcon={<DeleteIcon />}
//                   variant="outlined"
//                   color="error"
//                   size="small"
//                 >
//                   Delete
//                 </Button>
//               </>
//             )}
//           </Box>
//         </Box>
        
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Avatar
//             src={currentForum.user.image || ''}
//             alt={currentForum.user.name || 'User'}
//             sx={{ width: 36, height: 36, mr: 1 }}
//           />
//           <Typography variant="body2" color="text.secondary">
//             Posted by {currentForum.user.name || 'Unknown user'} on {formatDate(currentForum.createdAt)}
//           </Typography>
//         </Box>
        
//         <Box sx={{ mb: 2 }}>
//           {currentForum.tags.map(({ tag }) => (
//             <Chip
//               key={tag.id}
//               label={tag.name}
//               size="small"
//               sx={{ mr: 1, mb: 1 }}
//             />
//           ))}
//         </Box>
        
//         <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', mb: 3 }}>
//           {currentForum.description}
//         </Typography>
        
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//           <Button
//             startIcon={
//               currentForum.userLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />
//             }
//             onClick={handleLikeToggle}
//             disabled={!session}
//             sx={{ mr: 1 }}
//           >
//             {currentForum.userLiked ? 'Liked' : 'Like'}
//           </Button>
//           <Typography variant="body2" color="text.secondary">
//             {currentForum._count?.likes || 0} likes • {currentForum._count?.comments || 0} comments
//           </Typography>
//         </Box>
        
//         <Divider sx={{ mb: 3 }} />
        
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             Comments
//           </Typography>
          
//           {session ? (
//             <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 placeholder="Add a comment..."
//                 value={commentContent}
//                 onChange={(e) => setCommentContent(e.target.value)}
//                 error={!!error}
//                 helperText={error}
//                 sx={{ mb: 1 }}
//               />
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   endIcon={<SendIcon />}
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? 'Submitting...' : 'Submit'}
//                 </Button>
//               </Box>
//             </Box>
//           ) : (
//             <Alert severity="info" sx={{ mb: 3 }}>
//               Please <Link href="/auth/signin">sign in</Link> to post a comment
//             </Alert>
//           )}
          
//           {commentsLoading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <CommentList
//               comments={comments}
//               userId={session?.user?.id}
//               onDelete={handleDeleteComment}
//             />
//           )}
//         </Box>
//       </Paper>

//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>Delete Forum</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this forum? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
//           <Button onClick={handleDeleteForum} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }



// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "next/navigation";
// import { fetchForumById } from "@/redux/slices/forumSlice";
// // import { fetchComments } from "@/redux/slices/commentSlice";
// import CommentList from "@/components/comment/CommentList";
// import CommentForm from "@/components/comment/CommentForm";
// import { Container, Typography, Box, Divider } from "@mui/material";

// export default function ForumDetailPage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const forum = useSelector((state: any) => state.forum.currentForum);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchForumById(id as string) as any);
//       // dispatch(fetchComments(id as string) as any);
//     }
//   }, [id, dispatch]);

//   if (!forum) return <Typography>Loading...</Typography>;

//   return (
//     <Container maxWidth="md">
//       <Box mt={4}>
//         <Typography variant="h4" gutterBottom>{forum.title}</Typography>
//         <Typography variant="body1" gutterBottom>{forum.description}</Typography>
//         <Divider sx={{ my: 2 }} />

//         <Typography variant="h6">Comments</Typography>
//         {/* <CommentList forumId={id as string} /> */}

//         <Box mt={4}>
//           {/* <CommentForm forumId={id as string} /> */}
//         </Box>
//       </Box>
//     </Container>
//   );
// }

// import { GetServerSideProps } from 'next';
// import { Card, CardContent, Typography } from '@mui/material';
// import prisma from '@/lib/prisma';

// export default function ForumDetailPage({ forum }: { forum: any }) {
//   if (!forum) {
//     return <Typography variant="h6">Forum not found</Typography>;
//   }

//   return (
//     <Card sx={{ mb: 2 }}>
//       <CardContent>
//         <Typography variant="h4">{forum.title}</Typography>
//         <Typography variant="body1" sx={{ mt: 2 }}>
//           {forum.description}
//         </Typography>
//         <Typography variant="caption" sx={{ display: 'block', mt: 2 }}>
//           Tags: {forum.tags?.join(', ')}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { forumId } = context.params!;
//   const forum = await prisma.forum.findUnique({
//     where: { id: forumId as string },
//     include: { user: true },
//   });

//   return {
//     props: {
//       forum: forum || null,
//     },
//   };
// };



// app/forums/[id]/page.tsx (if using App Router)
// 'use client';
// import React, { useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { fetchForumById } from '@/redux/slices/forumSlice';
// import { Typography, Container, Box } from '@mui/material';

// export default function ForumDetailPage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { selectedForum, loading, error } = useSelector((state: RootState) => state.forum);
// console.log(id, "iiiiiiiiiiiiiii")
//   useEffect(() => {
//     dispatch(fetchForumById(id as string));
//   }, [dispatch, id]);

//   if (loading) return <Typography>Loading...</Typography>;
//   if ( !selectedForum) return <Typography>Error loading forum.</Typography>;

//   return (
//     <Container>
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" gutterBottom>{selectedForum.title}</Typography>
//         <Typography variant="body1" color="text.secondary">{selectedForum.description}</Typography>
//         <Typography variant="caption" color="text.disabled">
//           Posted on {new Date(selectedForum.createdAt).toLocaleString()}
//         </Typography>
//         {/* Add comments section here */}
//       </Box>
//     </Container>
//   );
// }


// "use client"
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'next/navigation';
// import { fetchForumById, setForumLikeStatus, createComment }  from '@/redux/slices/forumSlice';
// import { Container, Box, Typography, CircularProgress, TextField, Button, List, ListItem, IconButton } from '@mui/material';
// import { ThumbUp, ThumbDown } from '@mui/icons-material';

// export default function ForumDetailPage() {
//   const { id } = useParams(); // Retrieve the forum id from the URL
//   const dispatch = useDispatch();
//   const { selectedForum, loading, error } = useSelector((state) => state.forum);
//   const [newComment, setNewComment] = useState('');
//   const [likeStatus, setLikeStatus] = useState<boolean | null>(null); // Track like status

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchForumById(id as string));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (selectedForum) {
//       setLikeStatus(selectedForum.userLiked ?? null); // Set likeStatus based on selectedForum data
//     }
//   }, [selectedForum]);

//   const handleCommentSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newComment.trim()) {
//       // Dispatch action to create a new comment
//       dispatch(createComment({ forumId: id as string, content: newComment }));
//       setNewComment('');
//     }
//   };

//   const handleLikeToggle = () => {
//     if (likeStatus === null) return; // Prevent action if likeStatus is undefined
//     dispatch(setForumLikeStatus({ forumId: id as string, liked: !likeStatus }));
//     setLikeStatus(!likeStatus);
//   };

//   if (loading) return <CircularProgress />;
//   if (error || !selectedForum) return <Typography>Error loading forum</Typography>;

//   return (
//     <Container>
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           {selectedForum.title}
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           {selectedForum.description}
//         </Typography>
//         <Typography variant="caption" color="text.disabled">
//           Posted on {new Date(selectedForum.createdAt).toLocaleString()}
//         </Typography>

//         {/* Likes Section */}
//         <Box sx={{ mt: 2 }}>
//           <IconButton
//             color={likeStatus ? 'primary' : 'default'}
//             onClick={handleLikeToggle}
//             aria-label="like"
//           >
//             <ThumbUp />
//           </IconButton>
//           <Typography variant="body2" sx={{ display: 'inline', ml: 1 }}>
//             {selectedForum._count?.likes} Likes
//           </Typography>
//         </Box>

//         {/* Comments Section */}
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Comments
//           </Typography>
//           <form onSubmit={handleCommentSubmit}>
//             <TextField
//               label="Add a comment"
//               fullWidth
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               required
//               multiline
//               rows={3}
//               sx={{ mb: 2 }}
//             />
//             <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
//               Post Comment
//             </Button>
//           </form>

//           {/* Display comments */}
//           <List>
//             {selectedForum.comments && selectedForum.comments.map((comment) => (
//               <ListItem key={comment.id}>
//                 <Typography variant="body2" color="text.secondary">
//                   {comment.content} - <b>{comment.user?.email}</b>
//                 </Typography>
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Box>
//     </Container>
//   );
// }

// "use client"
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'next/navigation';
// import { fetchForumById, createComment, setForumLikeStatus } from '@/redux/slices/forumSlice';
// import { Container, Box, Typography, CircularProgress, TextField, Button, List, ListItem, IconButton } from '@mui/material';
// import { ThumbUp } from '@mui/icons-material';

// export default function ForumDetailPage() {
//   const { id } = useParams(); // Retrieve the forum id from the URL
//   const dispatch = useDispatch();
//   const { selectedForum, loading, error } = useSelector((state) => state.forum);
//   const [newComment, setNewComment] = useState('');
//   const [likeStatus, setLikeStatus] = useState<boolean | null>(null); // Track like status

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchForumById(id as string));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (selectedForum) {
//       setLikeStatus(selectedForum.userLiked ?? null); // Set likeStatus based on selectedForum data
//     }
//   }, [selectedForum]);

//   const handleCommentSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newComment.trim()) {
//       // Dispatch action to create a new comment
//       dispatch(createComment({ forumId: id as string, content: newComment }));
//       setNewComment('');  // Clear the comment field
//     }
//   };

//   const handleLikeToggle = () => {
//     if (likeStatus === null) return; // Prevent action if likeStatus is undefined
//     dispatch(setForumLikeStatus({ forumId: id as string, liked: !likeStatus }));
//     setLikeStatus(!likeStatus);
//   };

//   if (loading) return <CircularProgress />;
//   if (error || !selectedForum) return <Typography>Error loading forum</Typography>;

//   return (
//     <Container>
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           {selectedForum.title}
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           {selectedForum.description}
//         </Typography>
//         <Typography variant="caption" color="text.disabled">
//           Posted on {new Date(selectedForum.createdAt).toLocaleString()}
//         </Typography>

//         {/* Likes Section */}
//         <Box sx={{ mt: 2 }}>
//           <IconButton
//             color={likeStatus ? 'primary' : 'default'}
//             onClick={handleLikeToggle}
//             aria-label="like"
//           >
//             <ThumbUp />
//           </IconButton>
//           <Typography variant="body2" sx={{ display: 'inline', ml: 1 }}>
//             {selectedForum._count?.likes} Likes
//           </Typography>
//         </Box>

//         {/* Comments Section */}
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Comments
//           </Typography>
//           <form onSubmit={handleCommentSubmit}>
//             <TextField
//               label="Add a comment"
//               fullWidth
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               required
//               multiline
//               rows={3}
//               sx={{ mb: 2 }}
//             />
//             <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
//               Post Comment
//             </Button>
//           </form>

//           {/* Display comments */}
//           <List>
//             {selectedForum.comments && selectedForum.comments.map((comment) => (
//               <ListItem key={comment.id}>
//                 <Typography variant="body2" color="text.secondary">
//                   {comment.content} - <b>{comment.user?.email}</b>
//                 </Typography>
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Box>
//     </Container>
//   );
// }



"use client"
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgress, Typography, Container, Box, IconButton, TextField, Button, List, ListItem } from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import { fetchForumById, setForumLikeStatus, toggleForumLike } from '@/redux/slices/forumSlice'
import { fetchCommentsByForumId } from '@/redux/slices/commentSlice';
import { addComment } from '@/redux/slices/commentSlice';

export default function ForumDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedForum, loading: forumLoading, error: forumError } = useSelector(
    (state) => state.forum
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const { comments, loading: commentsLoading, error: commentsError } = useSelector((state) => state.comment);

  const [newComment, setNewComment] = useState('');
  const [likeStatus, setLikeStatus] = useState<boolean | null>(null);

  // Fetch forum and its comments
  useEffect(() => {
    if (id) {
      dispatch(fetchForumById(id as string));
      dispatch(fetchCommentsByForumId(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedForum) {
      setLikeStatus(selectedForum.userLiked ?? null);
    }
  }, [selectedForum]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      dispatch(addComment({ forumId: id as string, content: newComment }));
      setNewComment('');
    }
  };

  const handleLikeToggle = async () => {

    console.log("clcik")
    if (likeStatus === null) return;

    try {
      const res = await toggleForumLike(id as string, !likeStatus);
      dispatch(setForumLikeStatus({ forumId: id as string, liked: !likeStatus, newLikeCount: res.likes }));
      setLikeStatus(!likeStatus);
    } catch (error) {
      console.error('Failed to toggle like:', error);
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
        <Typography variant="body1" color="text.secondary">
          {selectedForum.description}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Posted on {new Date(selectedForum.createdAt).toLocaleString()}
        </Typography>

        {/* Likes */}
        {user ? (
  <Box sx={{ mt: 2 }}>
    <IconButton
      color={likeStatus ? 'primary' : 'default'}
      onClick={handleLikeToggle}
      aria-label="like"
    >
      <ThumbUp />
    </IconButton>
    <Typography variant="body2" sx={{ display: 'inline', ml: 1 }}>
      {selectedForum._count?.likes ?? 0} Likes
    </Typography>
  </Box>
) : (
  <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
    Log in to like this post.
  </Typography>
)}
        {/* Comments */}
        {/* <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>

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

          {commentsLoading && <CircularProgress />}
          {commentsError && <Typography color="error">{commentsError}</Typography>}

          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id}>
                <Box>
                  <Typography variant="body2">{comment.content}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    — {comment.user?.email || 'Anonymous'}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box> */}
        {/* Comments */}
<Box sx={{ mt: 4 }}>
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
  {commentsError && <Typography color="error">{commentsError}</Typography>}

  <List>
    {comments.map((comment) => (
      <ListItem key={comment.id}>
        <Box>
          <Typography variant="body2">{comment.content}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            — {comment.user?.email || 'Anonymous'}
          </Typography>
        </Box>
      </ListItem>
    ))}
  </List>
</Box>

      </Box>
    </Container>
  );
}
