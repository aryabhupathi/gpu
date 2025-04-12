// import { Box, Button, Container, Typography } from '@mui/material';
// import Link from 'next/link';

// export default function NotFound() {
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
//         <Typography variant="h1" component="h1" gutterBottom>
//           404
//         </Typography>
//         <Typography variant="h4" gutterBottom>
//           Page Not Found
//         </Typography>
//         <Typography variant="body1" color="text.secondary" paragraph>
//           The page you are looking for does not exist or has been moved.
//         </Typography>
//         <Button variant="contained" component={Link} href="/">
//           Return to Home
//         </Button>
//       </Box>
//     </Container>
//   );
// }

import { Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>404 - Page Not Found</Typography>
      <Typography gutterBottom>The page you're looking for doesn't exist.</Typography>
      <Button variant="contained" onClick={() => router.push("/")}>Return Home</Button>
    </Container>
  );
}
