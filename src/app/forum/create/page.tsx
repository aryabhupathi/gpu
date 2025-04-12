// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '@/redux/store';
// import { createForum } from '@/redux/slices/forumSlice';
// import { useSession } from 'next-auth/react';
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Paper,
//   Alert,
//   Chip,
//   Stack,
//   Autocomplete,
// } from '@mui/material';

// export default function CreateForumPage() {
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const { status } = useSession();
  
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [tags, setTags] = useState<string[]>([]);
//   const [inputTag, setInputTag] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Predefined tags for the autocomplete
//   const suggestedTags = [
//     'technology', 'health', 'education', 'sports', 'food',
//     'travel', 'finance', 'science', 'art', 'music',
//     'politics', 'environment', 'business', 'gaming', 'books'
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // Validation
//     if (!title.trim()) {
//       setError('Title is required');
//       return;
//     }

//     if (!description.trim()) {
//       setError('Description is required');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const resultAction = await dispatch(createForum({ title, description, tags }));
//       if (createForum.fulfilled.match(resultAction)) {
//         router.push('/');
//       } else if (createForum.rejected.match(resultAction)) {
//         setError(resultAction.payload as string);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (status === 'unauthenticated') {
//     return (
//       <Container maxWidth="md" sx={{ my: 4 }}>
//         <Alert severity="warning">
//           You need to be signed in to create a forum
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md">
//       <Box sx={{ my: 4 }}>
//         <Paper sx={{ p: 4 }}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             Create a New Forum
//           </Typography>
          
//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error}
//             </Alert>
//           )}
          
//           <Box component="form" onSubmit={handleSubmit} noValidate>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="title"
//               label="Forum Title"
//               name="title"
//               autoFocus
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
            
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="description"
//               label="Description"
//               name="description"
//               multiline
//               rows={6}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
            
//             <Autocomplete
//               multiple
//               freeSolo
//               id="tags"
//               options={suggestedTags}
//               value={tags}
//               inputValue={inputTag}
//               onInputChange={(_, newValue) => setInputTag(newValue)}
//               onChange={(_, newValue) => setTags(newValue as string[])}
//               renderTags={(value, getTagProps) =>
//                 value.map((option, index) => (
//                   <Chip 
//                     label={option} 
//                     {...getTagProps({ index })} 
//                     key={index}
//                   />
//                 ))
//               }
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   margin="normal"
//                   label="Tags"
//                   placeholder="Add tags"
//                   helperText="Press Enter to add tags"
//                 />
//               )}
//             />
            
//             <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={isLoading}
//                 sx={{ flex: 1 }}
//               >
//                 {isLoading ? 'Creating...' : 'Create Forum'}
//               </Button>
//               <Button
//                 variant="outlined"
//                 onClick={() => router.back()}
//                 sx={{ flex: 1 }}
//               >
//                 Cancel
//               </Button>
//             </Stack>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createForum } from "@/redux/slices/forumSlice";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack
} from "@mui/material";

export default function CreateForumPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async () => {
    const success = await dispatch(createForum({ title, description, tags: tags.split(",") }) as any);
    if (success) router.push("/");
  };


  
  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>Create New Forum</Typography>
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
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create Forum
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}


// 'use client';

// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { createForum } from '@/redux/slices/forumSlice';
// import { useRouter } from 'next/navigation';
// import {
//   Container,
//   Typography,
//   TextField,
//   Stack,
//   Button,
//   Box,
// } from '@mui/material';

// export default function CreateForumPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [tags, setTags] = useState('');

//   const handleSubmit = async () => {
//     const success = await dispatch(
//       createForum({ title, description, tags: tags.split(',') }) as any
//     );
//     if (success.meta.requestStatus === 'fulfilled') {
//       router.push('/');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box mt={5}>
//         <Typography variant="h5" gutterBottom>
//           Create New Forum
//         </Typography>
//         <Stack spacing={2}>
//           <TextField
//             label="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="Description"
//             value={description}
//             multiline
//             minRows={4}
//             onChange={(e) => setDescription(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="Tags (comma-separated)"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             fullWidth
//           />
//           <Button onClick={handleSubmit} variant="contained" color="primary">
//             Create Forum
//           </Button>
//         </Stack>
//       </Box>
//     </Container>
//   );
// }
// "use client"
// import { useState } from 'react';
// import { Button, TextField, Box, CircularProgress, Typography } from '@mui/material';
// import { useRouter } from 'next/navigation';

// export default function CreateForumPage() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [tags, setTags] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const tagsArray = tags.split(',').map(tag => tag.trim());

//     try {
//       const response = await fetch('/api/forums', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ title, description, tags: tagsArray }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create forum');
//       }

//       const forum = await response.json();

//       // After creation, redirect to the forum detail page or update state as needed
//       router.push(`/forum/${forum.id}`);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
//       <Typography variant="h4" sx={{ mb: 2 }}>Create a New Forum</Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Forum Title"
//           variant="outlined"
//           fullWidth
//           required
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Description"
//           variant="outlined"
//           fullWidth
//           multiline
//           required
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Tags (comma separated)"
//           variant="outlined"
//           fullWidth
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           type="submit"
//           disabled={loading}
//           sx={{ width: '100%' }}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Create Forum'}
//         </Button>
//       </form>
//     </Box>
//   );
// }
