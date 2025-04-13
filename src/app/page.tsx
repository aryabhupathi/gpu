"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  Pagination,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const forumsPerPage = 12;
  useEffect(() => {
    dispatch(fetchForums());
  }, [dispatch]);
  const filteredForums = forums.filter(
    (forum) =>
      forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredForums.length / forumsPerPage);
  const paginatedForums = filteredForums.slice(
    (page - 1) * forumsPerPage,
    page * forumsPerPage
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
            mt={3}
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Community Forums
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            gutterBottom
          >
            Join discussions, share ideas, and connect with others.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            {user ? (
              <Link href="/forum/create" passHref>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ textTransform: "none" }}
                >
                  Create Forum
                </Button>
              </Link>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Please log in to create a forum.
              </Typography>
            )}
          </Box>
          <TextField
            fullWidth
            placeholder="Search forums..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
              },
            }}
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
          <>
            <Grid container spacing={3}>
              {paginatedForums.map((forum) => (
                <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={forum.id}>
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
    </>
  );
}
