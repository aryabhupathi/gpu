// app/page.tsx
"use client";
import React, { useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchForums } from "@/redux/slices/forumSlice";
import ForumCard from "@/components/forum/ForumCard";
import Head from "next/head";
import Link from "next/link";
export default function Home() {
  const dispatch = useDispatch();
  const { forums, loading, error } = useSelector(
    (state: RootState) => state.forum
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = React.useState("");
  useEffect(() => {
    dispatch(fetchForums());
  }, [dispatch]);
  const filteredForums = forums.filter(
    (forum) =>
      forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <Head>
        <title>Community Forums</title>
        <meta
          name="description"
          content="Engage with the community through forums"
        />
      </Head>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Community Forums
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Join discussions, share ideas, and connect with others.
          </Typography>
          {user ? (
  <Link href="/forum/create" passHref>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      sx={{ textTransform: "none", mt: 2 }}
    >
      Create Forum
    </Button>
  </Link>
) : (
  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
    Please log in to create a forum.
  </Typography>
)}

          <TextField
            fullWidth
            placeholder="Search forums..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : filteredForums.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredForums.map((forum) => (
              <ForumCard key={forum.id} forum={forum} />
            ))}
          </Box>
        ) : (
          <Typography align="center" sx={{ my: 4 }}>
            No forums found. Be the first to create one!
          </Typography>
        )}
      </Container>
    </>
  );
}
