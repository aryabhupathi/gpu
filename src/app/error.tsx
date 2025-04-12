// 'use client';

// import { Box, Button, Container, Typography } from '@mui/material';
// import { useEffect } from 'react';

// export default function Error({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) {
//   useEffect(() => {
//     console.error(error);
//   }, [error]);

//   return (
//     <Container maxWidth="sm">
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           height: '50vh',
//           textAlign: 'center',
//         }}
//       >
//         <Typography variant="h4" gutterBottom>
//           Something went wrong
//         </Typography>
//         <Typography variant="body1" color="text.secondary" paragraph>
//           We apologize for the inconvenience. Please try again later.
//         </Typography>
//         <Button variant="contained" onClick={reset}>
//           Try again
//         </Button>
//       </Box>
//     </Container>
//   );
// }


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button } from "@mui/material";

export default function GlobalError({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <Typography variant="h4" color="error" gutterBottom>
        Something went wrong!
      </Typography>
      <Typography>{error.message}</Typography>
      <Button variant="contained" onClick={() => router.push("/")}>Go Home</Button>
    </Container>
  );
}