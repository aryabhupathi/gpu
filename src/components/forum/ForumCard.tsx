// import React from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Chip,
//   Avatar,
//   CardActionArea,
//   CardActions,
//   Button,
// } from '@mui/material';
// import { Comment as CommentIcon, ThumbUp as ThumbUpIcon } from '@mui/icons-material';
// import { formatDistanceToNow } from 'date-fns';
// import Link from 'next/link';

// interface ForumCardProps {
//   forum: {
//     id: string;
//     title: string;
//     description: string;
//     createdAt: string;
//     userId: string;
//     user: {
//       name: string;
//       image: string | null;
//     };
//     tags: Array<{
//       tag: {
//         id: string;
//         name: string;
//       }
//     }>;
//     _count?: {
//       comments: number;
//       likes: number;
//     };
//   };
// }

// export default function ForumCard({ forum }: ForumCardProps) {
//   return (
//     <Card>
//       <CardActionArea component={Link} href={`/forums/${forum.id}`}>
//         <CardContent>
//           <Typography variant="h6" component="h2" gutterBottom>
//             {forum.title}
//           </Typography>
//           <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
//             {forum.description}
//           </Typography>
          
//           <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
//             {forum.tags.map(({ tag }) => (
//               <Chip key={tag.id} label={tag.name} size="small" />
//             ))}
//           </Box>
          
//           <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
//             <Avatar 
//               alt={forum.user.name || 'User'} 
//               src={forum.user.image || ''} 
//               sx={{ width: 24, height: 24, mr: 1 }} 
//             />
//             <Typography variant="body2" color="text.secondary">
//               {forum.user.name} · {formatDistanceToNow(new Date(forum.createdAt), { addSuffix: true })}
//             </Typography>
//           </Box>
//         </CardContent>
//       </CardActionArea>
      
//       <CardActions>
//         <Button 
//           startIcon={<CommentIcon />} 
//           size="small" 
//           color="primary"
//           component={Link}
//           href={`/forums/${forum.id}`}
//         >
//           {forum._count?.comments || 0} Comments
//         </Button>
//         <Button 
//           startIcon={<ThumbUpIcon />} 
//           size="small" 
//           color="primary"
//           disabled
//         >
//           {forum._count?.likes || 0} Likes
//         </Button>
//       </CardActions>
//     </Card>
//   );
// }


import { Card, CardContent, Typography } from '@mui/material';

export default function ForumCard({ forum }: { forum: any }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{forum.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {forum.description}
        </Typography>
        <Typography variant="caption">
          Tags: {forum.tags?.join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
}
