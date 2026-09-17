"use client";
import React, { useTransition } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { updateProfile, deleteAccount } from "@/actions/userSettingsActions";
import SaveIcon from "@mui/icons-material/Save";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { UploadButton } from "@/lib/uploadthing";
import { Avatar } from "@mui/material";
import { updateAvatar } from "@/actions/userSettingsActions";
export default function UserSettings({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = React.useState("");
  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateProfile(formData);
        setSuccessMsg("Profile updated successfully!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("An error occurred");
        }
      }
    });
  };
  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone.",
      )
    ) {
      startTransition(async () => {
        await deleteAccount();
      });
    }
  };
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Profile Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your account&apos;s profile information.
      </Typography>
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Avatar src={user.image || ""} sx={{ width: 80, height: 80 }}>
          {user.name?.charAt(0) || "U"}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Profile Picture
          </Typography>
          <UploadButton
            endpoint="avatarUploader"
            onBeforeUploadBegin={async (files) => {
              const compressedFiles = await Promise.all(
                files.map(async (file) => {
                  if (file.type.startsWith("image/")) {
                    const options = {
                      maxSizeMB: 1,
                      maxWidthOrHeight: 1024,
                      useWebWorker: true,
                    };
                    try {
                      const imageCompression = (
                        await import("browser-image-compression")
                      ).default;
                      const compressedBlob = await imageCompression(
                        file,
                        options,
                      );
                      return new File([compressedBlob], file.name, {
                        type: compressedBlob.type,
                      });
                    } catch (error) {
                      console.error("Compression error:", error);
                      return file;
                    }
                  }
                  return file;
                }),
              );
              return compressedFiles;
            }}
            onClientUploadComplete={async (res) => {
              if (res?.[0]) {
                await updateAvatar(res[0].url);
                setSuccessMsg("Avatar updated successfully!");
              }
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </Box>
      </Box>
      <form action={handleSave}>
        <TextField
          label="Email Address"
          fullWidth
          disabled
          value={user.email}
          sx={{ mb: 3 }}
          helperText="Email cannot be changed."
        />
        <TextField
          label="Display Name"
          name="name"
          fullWidth
          defaultValue={user.name}
          sx={{ mb: 3 }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={
            isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          disabled={isPending}
        >
          Save Changes
        </Button>
      </form>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" color="error" gutterBottom>
        Danger Zone
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Permanently delete your account and all associated data (forums,
        comments, likes).
      </Typography>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteForeverIcon />}
        onClick={handleDelete}
        disabled={isPending}
      >
        Delete Account
      </Button>
    </Box>
  );
}
