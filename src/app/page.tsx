// 'use client';

// import React, { useEffect, useState } from 'react';
// import { 
//   Typography, 
//   Box, 
//   Container, 
//   CircularProgress, 
//   TextField, 
//   InputAdornment,
//   Grid,
// } from '@mui/material';
// import { Search as SearchIcon } from '@mui/icons-material';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { fetchForums } from '@/redux/slices/forumSlice';
// import ForumCard from '@/components/forum/ForumCard';

// export default function HomePage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { forums, loading, error } = useSelector((state: RootState) => state.forum);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(fetchForums());
//   }, [dispatch]);

//   const filteredForums = forums.filter((forum) =>
//     forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     forum.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
//           Community Forums
//         </Typography>
//         <Typography variant="body1" color="text.secondary" gutterBottom>
//           Join discussions, share ideas, and connect with others.
//         </Typography>
//         <TextField
//           fullWidth
//           placeholder="Search forums..."
//           variant="outlined"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ mt: 2 }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Typography color="error" align="center">
//           {error}
//         </Typography>
//       ) : filteredForums.length > 0 ? (
//         <Grid container spacing={3}>
//           {filteredForums.map((forum) => (
//             <Grid item xs={12} key={forum.id}>
//               <ForumCard forum={forum} />
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Typography align="center" sx={{ my: 4 }}>
//           No forums found. Be the first to create one!
//         </Typography>
//       )}
//     </Container>
//   );
// }


// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchForums } from "@/redux/slices/forumSlice";
// import ForumCard from "@/components/forum/ForumCard";
// import { Container, Typography } from "@mui/material";

// export default function HomePage() {
//   const dispatch = useDispatch();
//   const forums = useSelector((state: any) => state.forum.forums);

//   useEffect(() => {
//     dispatch(fetchForums() as any);
//   }, [dispatch]);

//   return (
//     <Container maxWidth="md">
//       <Typography variant="h4" gutterBottom>
//         Community Forums
//       </Typography>
//       {forums.map((forum: any) => (
//         <ForumCard key={forum.id} forum={forum} />
//       ))}
//     </Container>
//   );
// }


// app/page.tsx
"use client"
import React, { useEffect } from 'react';
import { Typography, Box, Container, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchForums } from '@/redux/slices/forumSlice';
import ForumCard from '@/components/forum/ForumCard';
import Head from 'next/head';

export default function Home() {
  const dispatch = useDispatch();
  const { forums, loading, error } = useSelector((state: RootState) => state.forum);
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    dispatch(fetchForums());
  }, [dispatch]);

  const filteredForums = forums.filter((forum) =>
    forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Community Forums</title>
        <meta name="description" content="Engage with the community through forums" />
      </Head>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Community Forums
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Join discussions, share ideas, and connect with others.
          </Typography>
          <TextField
            fullWidth
            placeholder="Search forums..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : filteredForums.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredForums.map((forum) => (
              <ForumCard key={forum.id} forum={forum} />
            ))}
          </Box>
        ) : (
          <Typography align="center" sx={{ my: 4 }}>
            No forums found. Be the first to create one!
          </Typography>
        )}
      </Container>
    </>
  );
}