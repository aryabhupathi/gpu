"use client"
import React from "react";
import { Box, Typography } from "@mui/material";

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
    </Box>
  );
};

export default Footer;
