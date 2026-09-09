"use client";

import { Button } from "@mui/material";
import { deleteForum } from "@/actions/forumActions";
import { useTransition } from "react";

export default function ProfileDeleteButton({ forumId }: { forumId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this forum?")) {
      startTransition(async () => {
        try {
          await deleteForum(forumId);
        } catch (err) {
          console.error("Delete failed", err);
        }
      });
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={handleDelete}
      disabled={isPending}
    >
      Delete
    </Button>
  );
}
