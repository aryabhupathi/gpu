"use client";
import React, { useState } from "react";
import {
  Typography,
  Box,
  Container,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import ForumCard from "@/components/forum/ForumCard";
import Link from "next/link";

type ForumItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string | null };
  tags: string[];
  _count: { likes: number; comments: number };
};

export default function HomeClient({
  initialForums,
  user,
}: {
  initialForums: ForumItem[];
  user: unknown;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "trending" | "discussed">(
    "latest",
  );
  const [page, setPage] = useState(1);
  const forumsPerPage = 12;

  // Extract all unique tags
  const allTags = Array.from(
    new Set(initialForums.flatMap((f) => f.tags)),
  ).slice(0, 10);

  let filteredForums = initialForums.filter((forum: ForumItem) => {
    const matchesSearch =
      forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = activeTag ? forum.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  // Apply Sorting
  filteredForums = filteredForums.sort((a, b) => {
    if (sortBy === "trending") return b._count.likes - a._count.likes;
    if (sortBy === "discussed") return b._count.comments - a._count.comments;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(filteredForums.length / forumsPerPage);
  const paginatedForums = filteredForums.slice(
    (page - 1) * forumsPerPage,
    page * forumsPerPage,
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 2,
          }}
        >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800 }}>
            Explore Discussions
          </Typography>

          {!!user && (
            <Link href="/forum/create" passHref>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
              >
                New Topic
              </Button>
            </Link>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <TextField
            placeholder="Search topics, people..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            sx={{
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F8FAFC",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            size="small"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "trending" | "discussed")}
            SelectProps={{ native: true }}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F8FAFC",
              },
            }}
          >
            <option value="latest">Latest</option>
            <option value="trending">Most Liked</option>
            <option value="discussed">Most Discussed</option>
          </TextField>
        </Box>

        {allTags.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mr: 1,
                alignSelf: "center",
                color: "text.secondary",
                fontWeight: 600,
              }}
            >
              Popular Tags:
            </Typography>
            <Chip
              label="All"
              onClick={() => {
                setActiveTag(null);
                setPage(1);
              }}
              color={activeTag === null ? "primary" : "default"}
              variant={activeTag === null ? "filled" : "outlined"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                onClick={() => {
                  setActiveTag(tag);
                  setPage(1);
                }}
                color={activeTag === tag ? "primary" : "default"}
                variant={activeTag === tag ? "filled" : "outlined"}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Box>
        )}
      </Box>

      {filteredForums.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedForums.map((forum: ForumItem) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={forum.id}>
                <ForumCard forum={forum} />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Typography align="center" sx={{ my: 4 }}>
          No forums found. Be the first to create one!
        </Typography>
      )}
    </Container>
  );
}
