// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { fetchUserProfile } from '@/redux/slices/authSlice';
// import { fetchForums } from '@/redux/slices/forumSlice';
// import { 
//   Avatar, 
//   Box, 
//   Container, 
//   Typography, 
//   Tabs, 
//   Tab, 
//   Divider,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import ForumCard from '@/components/forum/ForumCard';
// import { Forum } from '@/types';
// import { formatDate } from '@/lib/utils';

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`profile-tabpanel-${index}`}
//       aria-labelledby={`profile-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// export default function ProfilePage() {
//   const { data: session, status } = useSession();
//   const dispatch = useDispatch<AppDispatch>();
//   const { user, loading: userLoading } = useSelector((state: RootState) => state.auth);
//   const { forums, loading: forumsLoading } = useSelector((state: RootState) => state.forum);
//   const [tabValue, setTabValue] = useState(0);

//   useEffect(() => {
//     if (session?.user?.id) {
//       dispatch(fetchUserProfile(session.user.id));
//       dispatch(fetchForums());
//     }
//   }, [dispatch, session]);

//   const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   if (status === 'loading' || userLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (status === 'unauthenticated') {
//     return (
//       <Container maxWidth="md" sx={{ my: 4 }}>
//         <Alert severity="warning">
//           You need to be signed in to view your profile
//         </Alert>
//       </Container>
//     );
//   }

//   const userForums = forums.filter(forum => forum.userId === session?.user?.id);

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
//         <Avatar
//           src={user?.image || ''}
//           alt={user?.name || 'User'}
//           sx={{ width: 100, height: 100, mr: 3 }}
//         />
//         <Box>
//           <Typography variant="h4" gutterBottom>
//             {user?.name || 'User'}
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             {user?.email}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Member since: {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
//           </Typography>
//         </Box>
//       </Box>

//       <Divider sx={{ mb: 2 }} />

//       <Box sx={{ width: '100%' }}>
//         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//           <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
//             <Tab label="My Forums" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
//             <Tab label="My Activity" id="profile-tab-1" aria-controls="profile-tabpanel-1" />
//           </Tabs>
//         </Box>
//         <TabPanel value={tabValue} index={0}>
//           {forumsLoading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
//               <CircularProgress />
//             </Box>
//           ) : userForums.length > 0 ? (
//             userForums.map((forum: Forum) => (
//               <Box key={forum.id} sx={{ mb: 2 }}>
//                 <ForumCard forum={forum} />
//               </Box>
//             ))
//           ) : (
//             <Typography variant="body1" color="text.secondary" align="center">
//               You haven&apos;t created any forums yet.
//             </Typography>
//           )}
//         </TabPanel>
//         <TabPanel value={tabValue} index={1}>
//           <Typography variant="body1" color="text.secondary" align="center">
//             Recent activity will be displayed here.
//           </Typography>
//         </TabPanel>
//       </Box>
//     </Container>
//   );
// }

// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserForums } from "@/redux/slices/forumSlice";
// import { fetchUserComments } from "@/redux/slices/commentSlice";
// import ForumCard from "@/components/forum/ForumCard";
// import { Container, Typography, Divider } from "@mui/material";

// export default function ProfilePage() {
//   const { data: session } = useSession();
//   const dispatch = useDispatch();
//   const forums = useSelector((state: any) => state.forum.userForums);
//   const comments = useSelector((state: any) => state.comment.userComments);

//   useEffect(() => {
//     if (session?.user?.email) {
//       dispatch(fetchUserForums() as any);
//       dispatch(fetchUserComments() as any);
//     }
//   }, [session, dispatch]);

//   if (!session) return <Typography>Please sign in to view your profile.</Typography>;

//   return (
//     <Container maxWidth="md">
//       <Typography variant="h4" gutterBottom>Your Profile</Typography>

//       <Typography variant="h6" gutterBottom>Your Forums</Typography>
//       {forums.map((forum: any) => (
//         <ForumCard key={forum.id} forum={forum} />
//       ))}

//       <Divider sx={{ my: 4 }} />

//       <Typography variant="h6" gutterBottom>Your Comments</Typography>
//       {comments.map((comment: any) => (
//         <Typography key={comment.id} variant="body2" gutterBottom>
//           On forum <strong>{comment.forumTitle}</strong>: {comment.content}
//         </Typography>
//       ))}
//     </Container>
//   );
// }



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

  const forums = useSelector((state: RootState) => state.forum.forums);
  const comments = useSelector((state: RootState) => state.comment.comments);
  const forumLoading = useSelector((state: RootState) => state.forum.loading);
  const commentLoading = useSelector((state: RootState) => state.comment.loading);

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchUserForums() as any);
      dispatch(fetchUserComments() as any);
    }
  }, [session, dispatch]);

  const handleDelete = async (forumId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this forum?");
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
      <Typography variant="h4" gutterBottom>Your Profile</Typography>

      <Typography variant="h6" gutterBottom>Your Forums</Typography>
      {forumLoading ? (
        <CircularProgress />
      ) : forums.length > 0 ? (
        forums.map((forum: any) => (
          <Box key={forum.id} sx={{ mb: 2 }}>
            <ForumCard forum={forum} />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Link href={`/forum/edit/${forum.id}`} passHref>
                <Button variant="outlined" size="small">Edit</Button>
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

      <Typography variant="h6" gutterBottom>Your Comments</Typography>
      {commentLoading ? (
        <CircularProgress />
      ) : comments.length > 0 ? (
        comments.map((comment: any) => (
          <Box key={comment.id} sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              On forum{" "}
              <Link href={`/forum/${comment.forumId}`}>
                <strong>{comment.forumTitle}</strong>
              </Link>: {comment.content}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          You havent commented on any forums yet.
        </Typography>
      )}
    </Container>
  );
}
