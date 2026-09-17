"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
export default function SearchFilter({
  placeholder = "Search forums...",
  showSort = true,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "latest";
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      if (sort !== "latest") {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }
      const newUrl = `${pathname}?${params.toString()}`;
      const currentUrl = `${pathname}?${searchParams.toString()}`;
      if (newUrl !== currentUrl) {
        router.replace(newUrl, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [query, sort, pathname, router, searchParams]);
  const handleSortChange = (event: SelectChangeEvent) => {
    setSort(event.target.value);
  };
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 4,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{
          bgcolor: "background.paper",
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
      {showSort && (
        <FormControl
          sx={{ minWidth: 200, bgcolor: "background.paper", borderRadius: 3 }}
        >
          <Select
            value={sort}
            onChange={handleSortChange}
            displayEmpty
            sx={{ borderRadius: 3 }}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon color="action" sx={{ ml: 1 }} />
              </InputAdornment>
            }
          >
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
