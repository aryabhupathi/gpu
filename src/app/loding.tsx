// import { Box, CircularProgress, Typography } from '@mui/material';

// export default function Loading() {
//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '50vh',
//       }}
//     >
//       <CircularProgress size={60} thickness={4} />
//       <Typography variant="h6" sx={{ mt: 2 }}>
//         Loading...
//       </Typography>
//     </Box>
//   );
// }

"use client";

import { CircularProgress, Container, Box } from "@mui/material";

export default function GlobalLoading() {
  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    </Container>
  );
}

