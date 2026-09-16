"use client";

import React, { useEffect, useState, useRef } from "react";
import ForumCard from "./ForumCard";
import { getForumsPaginated } from "@/actions/forumActions";
import { CircularProgress, Box, Typography } from "@mui/material";

type ForumItem = any; // You can refine this type based on what getForumsPaginated returns

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
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Reset state when q or sort changes
    setForums(initialForums);
    setNextCursor(initialNextCursor);
  }, [initialForums, initialNextCursor, q, sort]);

  const fetchMoreForums = async () => {
    if (loading || !nextCursor) return;
    setLoading(true);
    try {
      const { forums: newForums, nextCursor: newCursor } = await getForumsPaginated(
        nextCursor,
        10,
        q,
        sort
      );
      setForums((prev) => [...prev, ...newForums]);
      setNextCursor(newCursor);
    } catch (error) {
      console.error("Error fetching more forums", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loading) {
          fetchMoreForums();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [nextCursor, loading, q, sort]);

  return (
    <>
      {forums.length === 0 ? (
        <Typography>No forums found matching your search.</Typography>
      ) : (
        forums.map((forum) => <ForumCard key={forum.id} forum={forum} />)
      )}

      {nextCursor && (
        <Box ref={observerRef} sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
          {loading && <CircularProgress />}
        </Box>
      )}
    </>
  );
}
