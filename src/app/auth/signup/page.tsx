"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpValues) => {
    setGeneralError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData = await res.json();
        
        if (res.ok) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/auth/signin");
          }, 1500);
        } else {
          setGeneralError(resData.error || "Signup failed");
        }
      } catch {
        setGeneralError("Network error. Please try again.");
      }
    });
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h5" gutterBottom align="center">
          Create an Account
        </Typography>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account created successfully! Redirecting to login...
          </Alert>
        )}
        {generalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError}
          </Alert>
        )}
        <Stack spacing={2}>
          <TextField
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
            disabled={isPending || success}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            required
            disabled={isPending || success}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            required
            disabled={isPending || success}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isPending || success}
            fullWidth
          >
            {isPending ? <CircularProgress size={24} /> : "Sign Up"}
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
