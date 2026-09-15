"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  Divider,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const signInSchema = z.object({
  identifier: z.string().min(1, "Please enter a valid email or mobile number"),
  password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInValues) => {
    setGeneralError(null);
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          identifier: data.identifier,
          password: data.password,
        });

        if (result?.error) {
          setGeneralError(result.error);
        } else if (result?.ok) {
          router.push("/");
        }
      } catch {
        setGeneralError("Failed to connect. Please try again.");
      }
    });
  };

  return (
    <Container maxWidth="xs">
      <Box
        mt={8}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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
        {generalError && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {generalError}
          </Alert>
        )}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <TextField
            label="Email or Mobile Number"
            type="text"
            {...register("identifier")}
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
            fullWidth
            required
            disabled={isPending}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            required
            disabled={isPending}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isPending}
            fullWidth
          >
            {isPending ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Divider sx={{ my: 2 }}>or</Divider>
          <Box textAlign="center" mt={1}>
            <Typography variant="body2">
              Don&apos;t have an account?{" "}
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
