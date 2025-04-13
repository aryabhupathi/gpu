// import React from "react";
// import { Card, CardContent, Typography, Box } from "@mui/material";
// import Link from "next/link";
// interface ForumCardProps {
//   forum: {
//     id: string;
//     title: string;
//     description: string;
//     createdAt: string;
//     tags?: string[];
//     user: {
//       id: string;
//       name: string;
//     };
//   };
// }
// export default function ForumCard({ forum }: ForumCardProps) {
//   return (
//     <Link href={`/forum/${forum.id}`} passHref>
//       <Card
//         variant="outlined"
//         sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
//       >
//         <CardContent>
//           <Typography variant="h6" fontWeight="bold">
//             {forum.title}
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
//             {forum.description}
//           </Typography>
//           <Typography variant="caption" color="text.disabled">
//       By: {forum.user?.name || "Unknown"}
//     </Typography>
//           <Typography variant="caption" color="text.disabled">
//             Created at: {new Date(forum.createdAt).toLocaleString()}
//           </Typography>
//           <Typography variant="caption" color="text.disabled">
//             comments: ({forum.comments.length})
//           </Typography>
          
//           <Typography variant="caption" color="text.disabled">
//             likes: ({forum.likes.length})
//           </Typography>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }


import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Link from "next/link";

interface ForumCardProps {
  forum: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    tags?: string[];
    user: {
      id: string;
      name: string;
    };
    comments?: { length: number }; 
    likes?: { length: number }; 
  };
}

export default function ForumCard({ forum }: ForumCardProps) {
  return (
    <Link href={`/forum/${forum.id}`} passHref>
      <Card
        variant="outlined"
        sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {forum.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            {forum.description}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            By: {forum.user?.name || "Unknown"}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Created at: {new Date(forum.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Comments: ({forum.comments?.length || 0})
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Likes: ({forum.likes?.length || 0})
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
