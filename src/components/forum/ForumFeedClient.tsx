"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ForumCard from "./ForumCard";
import { getForumsPaginated } from "@/actions/forumActions";
import { CircularProgress, Box, Typography } from "@mui/material";
export interface ForumItem {
  id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  isPrivate?: boolean;
  tags?: string[];
  user: {
    id: string;
    name: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}
interface ForumFeedClientProps {
  initialForums: ForumItem[];
  initialNextCursor?: string;
  q?: string;
  sort?: string;
}
export default function ForumFeedClient({
  initialForums,
  initialNextCursor,
  q,
  sort,
}: ForumFeedClientProps) {
  const [forums, setForums] = useState<ForumItem[]>(initialForums);
  const [nextCursor, setNextCursor] = useState<string | undefined>(
    initialNextCursor,
  );
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setForums(initialForums);
    setNextCursor(initialNextCursor);
  }, [initialForums, initialNextCursor]);
  const fetchMoreForums = useCallback(async () => {
    if (loading || !nextCursor) return;
    setLoading(true);
    try {
      const { forums: newForums, nextCursor: newCursor } =
        await getForumsPaginated(nextCursor, 10, q, sort);
      setForums((prev) => [...prev, ...newForums]);
      setNextCursor(newCursor);
    } catch (error) {
      console.error("Error fetching more forums", error);
    } finally {
      setLoading(false);
    }
  }, [loading, nextCursor, q, sort]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loading) {
          fetchMoreForums();
        }
      },
      { threshold: 1.0 },
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [nextCursor, loading, fetchMoreForums]);
  return (
    <>
      {forums.length === 0 ? (
        <Typography>No forums found matching your search.</Typography>
      ) : (
        forums.map((forum) => <ForumCard key={forum.id} forum={forum} />)
      )}
      {nextCursor && (
        <Box
          ref={observerRef}
          sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}
        >
          {loading && <CircularProgress />}
        </Box>
      )}
    </>
  );
}
