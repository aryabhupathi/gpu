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
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  // Password validation
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };
  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };
  const validateForm = () => {
    const newErrors = {
      name: name.trim() === "" ? "Name is required" : "",
      email: email.trim() === "" ? "Email is required" : validateEmail(email),
      password:
        password === "" ? "Password is required" : validatePassword(password),
      general: "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setErrors({ ...errors, general: "" });
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        // Delay redirect to show success message
        setTimeout(() => {
          router.push("/auth/signin");
        }, 1500);
      } else {
        setErrors({ ...errors, general: data.error || "Signup failed" });
      }
    } catch (error) {
      setErrors({ ...errors, general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="xs">
      <Box mt={8} component="form" onSubmit={handleSignup} noValidate>
        <Typography variant="h5" gutterBottom align="center">
          Create an Account
        </Typography>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account created successfully! Redirecting to login...
          </Alert>
        )}
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() =>
              setErrors({
                ...errors,
                name: name.trim() === "" ? "Name is required" : "",
              })
            }
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (email.trim() === "") {
                setErrors({ ...errors, email: "Email is required" });
              } else {
                setErrors({ ...errors, email: validateEmail(email) });
              }
            }}
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
            onBlur={() => {
              if (password === "") {
                setErrors({ ...errors, password: "Password is required" });
              } else {
                setErrors({ ...errors, password: validatePassword(password) });
              }
            }}
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
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Box textAlign="center" mt={1}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="/auth/signin" underline="hover">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
