// 'use client';

// import { useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { signIn } from 'next-auth/react';
// import Link from 'next/link';
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Paper,
//   Alert,
//   Divider,
// } from '@mui/material';

// export default function SignIn() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl') || '/';
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const result = await signIn('credentials', {
//         redirect: false,
//         email,
//         password,
//       });

//       if (result?.error) {
//         setError(result.error);
//       } else {
//         router.push(callbackUrl);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ my: 8 }}>
//         <Paper sx={{ p: 4 }}>
//           <Typography variant="h4" component="h1" align="center" gutterBottom>
//             Sign In
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
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Signing in...' : 'Sign In'}
//             </Button>
//           </Box>
          
//           <Divider sx={{ my: 2 }} />
          
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="body2">
//               Don&apos;t have an account?{' '}
//               <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
//                 Sign Up
//               </Link>
//             </Typography>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// }



// "use client";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Stack
// } from "@mui/material";

// export default function SignInPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleLogin = async () => {
//     const result = await signIn("credentials", {
//       redirect: false,
//       email,
//       password
//     });

//     if (result?.ok) router.push("/");
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box mt={8}>
//         <Typography variant="h5" gutterBottom>Sign In</Typography>
//         <Stack spacing={2}>
//           <TextField
//             label="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             fullWidth
//           />
//           <Button variant="contained" onClick={handleLogin}>Sign In</Button>
//         </Stack>
//       </Box>
//     </Container>
//   );
// }


"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
} from "@mui/material";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // State to hold error message
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleLogin = async () => {
    setError(null); // Reset any previous error
    setLoading(true); // Show loading state

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false); // Hide loading state

    if (result?.error) {
      setError(result.error); // Display error if sign-in fails
    } else if (result?.ok) {
      router.push("/"); // Redirect to home if successful
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error} {/* Show error message */}
          </Alert>
        )}
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            fullWidth
            disabled={loading} // Disable button when loading
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
