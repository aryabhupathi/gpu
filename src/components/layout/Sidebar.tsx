"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, SxProps, Theme, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import ForumIcon from "@mui/icons-material/Forum";
import CodeIcon from "@mui/icons-material/Code";
import PaletteIcon from "@mui/icons-material/Palette";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  sx?: SxProps<Theme>;
}

export default function Sidebar({ sx }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const getActiveStyle = (path: string) => {
    return pathname === path 
      ? { background: "rgba(255, 255, 255, 0.15)", color: "#fff", fontWeight: "bold" } 
      : { color: "#CBD5E1", "&:hover": { background: "rgba(255, 255, 255, 0.05)" } };
  };

  const getIconStyle = (gradient: string) => ({
    minWidth: 36,
    width: 36,
    height: 36,
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: gradient,
    color: "#fff",
    mr: 2,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  });

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        bgcolor: "#0F172A",
        color: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        borderTopRightRadius: 24,
        boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
        height: "100%", // full available height inside the flex container
        overflowY: "auto",
        overflowX: "hidden",
        pb: 2,
        ...sx
      }}
    >
      <Box sx={{ p: 3, display: { xs: "flex", md: "none" }, justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
          letstalk
        </Typography>
      </Box>

      {session && (
        <Box sx={{ px: 3, mb: 2 }}>
          <Button 
            component={Link} 
            href="/forum/create" 
            variant="contained" 
            fullWidth 
            sx={{ 
              background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
              borderRadius: "10px",
              py: 1,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.4)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(124, 58, 237, 0.6)",
              }
            }}
          >
            + New Topic
          </Button>
        </Box>
      )}

      <List sx={{ px: 2, gap: 1, display: "flex", flexDirection: "column" }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/" sx={{ borderRadius: 2, py: 1.5, ...getActiveStyle("/") }}>
            <ListItemIcon sx={getIconStyle("linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)")}><HomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Home" slotProps={{ primary: { fontWeight: pathname === "/" ? 700 : 500 } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/explore" sx={{ borderRadius: 2, py: 1.5, ...getActiveStyle("/explore") }}>
            <ListItemIcon sx={getIconStyle("linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)")}><ExploreIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Explore" slotProps={{ primary: { fontWeight: pathname === "/explore" ? 700 : 500 } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/messages" sx={{ borderRadius: 2, py: 1.5, ...getActiveStyle("/messages") }}>
            <ListItemIcon sx={getIconStyle("linear-gradient(135deg, #10B981 0%, #059669 100%)")}><ForumIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Messages" slotProps={{ primary: { fontWeight: pathname === "/messages" ? 700 : 500 } }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 3, mx: 2 }} />

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography variant="overline" sx={{ color: "#64748B", fontWeight: 800, letterSpacing: 1.2 }}>YOUR SPACES</Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1, gap: 1, display: "flex", flexDirection: "column" }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/spaces/tech-hub" sx={{ borderRadius: 2, py: 1.5, ...getActiveStyle("/spaces/tech-hub") }}>
            <ListItemIcon sx={getIconStyle("linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)")}><CodeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Tech Hub" slotProps={{ primary: { fontWeight: pathname === "/spaces/tech-hub" ? 700 : 500 } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/spaces/creative-lab" sx={{ borderRadius: 2, py: 1.5, ...getActiveStyle("/spaces/creative-lab") }}>
            <ListItemIcon sx={getIconStyle("linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)")}><PaletteIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Creative Lab" slotProps={{ primary: { fontWeight: pathname === "/spaces/creative-lab" ? 700 : 500 } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/spaces/gaming" sx={{ borderRadius: 2, py: 1.5, ...getActiveStyle("/spaces/gaming") }}>
            <ListItemIcon sx={getIconStyle("linear-gradient(135deg, #F59E0B 0%, #D97706 100%)")}><SportsEsportsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Gaming" slotProps={{ primary: { fontWeight: pathname === "/spaces/gaming" ? 700 : 500 } }} />
          </ListItemButton>
        </ListItem>
      </List>

    </Box>
  );
}
