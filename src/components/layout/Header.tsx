"use client";
import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
export default function Header() {
  const { data: session } = useSession();
  const navigate = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUser({
          name: session.user.name || "",
          image: session.user.image || null,
          email: session.user.email || "",
        })
      );
    } else {
      dispatch(clearUser());
    }
  }, [session, dispatch]);
  const handleSignOut = async () => {
    handleClose();
    await signOut({ redirect: false });
    dispatch(clearUser());
    navigate.push("/");
  };
  const handleProfile = () => {
    handleClose();
    navigate.push("/profile");
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          Community Forums
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                href="/forum/create"
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                sx={{ mr: 2 }}
              >
                New Forum
              </Button>
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  alt={user?.name || "User"}
                  src={user?.image || ""}
                  sx={{ width: 32, height: 32 }}
                >{!user?.image && (user?.name?.charAt(0).toUpperCase() || "U")}</Avatar>
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/auth/signin">
                Sign In
              </Button>
              <Button
                color="secondary"
                variant="contained"
                component={Link}
                href="/auth/signup"
                sx={{ ml: 1 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
