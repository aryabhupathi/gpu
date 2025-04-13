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
} from "@mui/material";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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
          <IconButton onClick={handleMenu} size="small" sx={{ ml: 1 }}>
            <Avatar
              alt={user?.name || "User"}
              src={user?.image || ""}
              sx={{ width: 32, height: 32 }}
            >
              {!user?.image && (user?.name?.charAt(0).toUpperCase() || "U")}
            </Avatar>
          </IconButton>
          {/* <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {isAuthenticated ? (
              <>
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
              </>
            ) : (
              <>
                <MenuItem disabled>Guest</MenuItem>
                <Divider />
                <MenuItem onClick={handleSignin}>Sign In</MenuItem>
              </>
            )}
          </Menu> */}
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
                  <MenuItem key="profile" onClick={handleProfile}>
                    Profile
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
    </AppBar>
  );
}
