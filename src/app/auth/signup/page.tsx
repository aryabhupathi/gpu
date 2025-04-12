// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { registerUser } from '@/redux/slices/authSlice';
// import { AppDispatch } from '@/redux/store';
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

// export default function SignUp() {
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // Validation
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const resultAction = await dispatch(registerUser({ name, email, password }));
//       if (registerUser.fulfilled.match(resultAction)) {
//         router.push('/auth/signin');
//       } else if (registerUser.rejected.match(resultAction)) {
//         setError(resultAction.payload as string);
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
//             Sign Up
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
//               id="name"
//               label="Full Name"
//               name="name"
//               autoComplete="name"
//               autoFocus
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
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
//               autoComplete="new-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="confirmPassword"
//               label="Confirm Password"
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Signing up...' : 'Sign Up'}
//             </Button>
//           </Box>
          
//           <Divider sx={{ my: 2 }} />
          
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="body2">
//               Already have an account?{' '}
//               <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
//                 Sign In
//               </Link>
//             </Typography>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Stack
// } from "@mui/material";

// export default function SignUpPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleSignUp = async () => {
//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });

//     if (res.ok) {
//       router.push("/auth/signin");
//     }
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box mt={8}>
//         <Typography variant="h5" gutterBottom>Sign Up</Typography>
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
//           <Button variant="contained" onClick={handleSignUp}>Sign Up</Button>
//         </Stack>
//       </Box>
//     </Container>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/auth/signin"); // Redirect to login after successful signup
    } else {
      const data = await res.json();
      alert(data.error || "Signup failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSignup}>
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

