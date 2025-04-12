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
  CircularProgress,
  Link,
  Divider,
} from "@mui/material";
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };
  // Form validation
  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
      password: !password.trim() ? "Password is required" : "",
      general: null,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(
      (error) => error !== "" && error !== null
    );
  };
  const handleLogin = async (e?: React.FormEvent) => {
    // Prevent default form submission if called from form submit event
    if (e) e.preventDefault();
    // Validate form
    if (!validateForm()) return;
    setErrors({ ...errors, general: null });
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setErrors({ ...errors, general: result.error });
      } else if (result?.ok) {
        router.push("/"); // Redirect to home if successful
      }
    } catch (error) {
      setErrors({ ...errors, general: "Failed to connect. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="xs">
      <Box
        mt={8}
        component="form"
        onSubmit={handleLogin}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {errors.general}
          </Alert>
        )}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setErrors({ ...errors, email: validateEmail(email) })}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() =>
              setErrors({
                ...errors,
                password: !password.trim() ? "Password is required" : "",
              })
            }
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            required
            disabled={loading}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Divider sx={{ my: 2 }}>or</Divider>
          {/* Optional: Add social login buttons here */}
          <Box textAlign="center" mt={1}>
            <Typography variant="body2">
              Dont have an account?
              <Link href="/auth/signup" underline="hover">
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
