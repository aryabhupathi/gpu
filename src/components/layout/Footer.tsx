"use client"
import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#282c34",
        color: "#fff",
        padding:"5px",
        textAlign: "center",
        position: "relative",
        bottom: 0,
        marginTop:"10px"
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} MyWebsite. All rights reserved.
      </Typography>
      <Typography variant="caption" color="textSecondary">
        <Link href="/privacy-policy" color="inherit" sx={{ mx: 1 }}>
          Privacy Policy
        </Link>
        |
        <Link href="/terms-of-service" color="inherit" sx={{ mx: 1 }}>
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
