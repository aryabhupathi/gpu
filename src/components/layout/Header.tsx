"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAppTheme } from "@/app/ThemeProviderClient";
interface SearchUser {
  id: string;
  name: string | null;
  image: string | null;
}
interface SearchForum {
  id: string;
  title: string;
}
interface SearchResults {
  forums: SearchForum[];
  users: SearchUser[];
}
export default function Header() {
  const { data: session } = useSession();
  const navigate = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { mode, toggleTheme } = useAppTheme();
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    handleClose();
    navigate.push("/profile");
  };
  const handleSignin = () => {
    handleClose();
    navigate.push("/auth/signin");
  };
  const handleSignOut = async () => {
    handleClose();
    await signOut({ redirect: false });
    dispatch(clearUser());
    navigate.push("/");
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    forums: [],
    users: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults({ forums: [], users: [] });
      setShowDropdown(false);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/search?q=${searchQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
          setShowDropdown(true);
        })
        .catch(console.error);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUser({
          name: session.user.name || "",
          image: session.user.image || null,
          email: session.user.email || "",
        }),
      );
    } else {
      dispatch(clearUser());
    }
  }, [session, dispatch]);
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component={Link}
            href="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none", gap: { xs: 1, sm: 1.5 } }}
          >
            <Box
              component="img"
              src="/logo-modern.png"
              alt="logo"
              sx={{ width: { xs: 32, sm: 48 }, height: { xs: 32, sm: 48 }, objectFit: "contain" }}
            />
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
                color: "transparent",
                fontWeight: 800,
                backgroundClip: "text",
                backgroundImage:
                  "linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)",
                letterSpacing: "-0.05em",
                fontSize: { sm: "1.25rem", md: "1.5rem" },
              }}
            >
              letstalk
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            mx: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{ position: "relative", width: { xs: "100%", md: "400px" } }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "action.hover",
                borderRadius: 4,
                px: 2,
                py: 0.5,
              }}
            >
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <Box
                component="input"
                type="text"
                placeholder="Search posts, users..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onFocus={() => {
                  if (searchQuery.length >= 2) setShowDropdown(true);
                }}
                sx={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  width: "100%",
                  padding: "8px 0",
                  fontSize: "1rem",
                  color: "text.primary",
                }}
              />
            </Box>
            {showDropdown &&
              (searchResults.forums.length > 0 ||
                searchResults.users.length > 0) && (
                <Paper
                  elevation={4}
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    mt: 1,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    zIndex: 9999,
                  }}
                >
                  {searchResults.users.length > 0 && (
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{
                          px: 2,
                          py: 1,
                          display: "block",
                          bgcolor: "action.hover",
                          color: "text.secondary",
                        }}
                      >
                        Users
                      </Typography>
                      {searchResults.users.map((u) => (
                        <MenuItem
                          key={u.id}
                          onClick={() => navigate.push(`/u/${u.id}`)}
                          sx={{ py: 1.5 }}
                        >
                          <Avatar
                            src={u.image || ""}
                            sx={{
                              width: 24,
                              height: 24,
                              mr: 1,
                              fontSize: "0.8rem",
                            }}
                          >
                            {u.name?.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" color="text.primary">
                            {u.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Box>
                  )}
                  {searchResults.forums.length > 0 && (
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{
                          px: 2,
                          py: 1,
                          display: "block",
                          bgcolor: "action.hover",
                          color: "text.secondary",
                        }}
                      >
                        Posts
                      </Typography>
                      {searchResults.forums.map((f) => (
                        <MenuItem
                          key={f.id}
                          onClick={() => navigate.push(`/forum/${f.id}`)}
                          sx={{
                            py: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                            sx={{ width: "100%", color: "text.primary" }}
                          >
                            {f.title}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Box>
                  )}
                </Paper>
              )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={toggleTheme}
            sx={{ mr: 1, color: "text.secondary" }}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          {session ? (
            <>
              <NotificationBell />
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 1, padding: 0.5, border: "2px solid #E2E8F0" }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {session.user?.name?.charAt(0) || "U"}
                </Avatar>
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleMenu} size="small" sx={{ ml: 1 }}>
              <Avatar
                alt={user?.name || "User"}
                src={
                  user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`
                }
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          )}
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {isAuthenticated
              ? [
                  ...(session?.user?.role === "ADMIN"
                    ? [
                        <MenuItem
                          key="admin"
                          onClick={() => {
                            handleClose();
                            navigate.push("/admin");
                          }}
                        >
                          Admin Dashboard
                        </MenuItem>,
                        <Divider key="divider-admin" />,
                      ]
                    : []),
                  <MenuItem key="profile" onClick={handleProfile}>
                    Profile
                  </MenuItem>,
                  <MenuItem
                    key="settings"
                    onClick={() => {
                      handleClose();
                      navigate.push("/settings");
                    }}
                  >
                    Settings
                  </MenuItem>,
                  <Divider key="divider-1" />,
                  <MenuItem key="signout" onClick={handleSignOut}>
                    Sign out
                  </MenuItem>,
                ]
              : [
                  <MenuItem key="guest" disabled>
                    Guest
                  </MenuItem>,
                  <Divider key="divider-2" />,
                  <MenuItem key="signin" onClick={handleSignin}>
                    Sign In
                  </MenuItem>,
                ]}
          </Menu>
        </Box>
      </Toolbar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            bgcolor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <Sidebar
          sx={{ width: "100%", height: "100%", top: 0, borderRadius: 0 }}
        />
      </Drawer>
    </AppBar>
  );
}
