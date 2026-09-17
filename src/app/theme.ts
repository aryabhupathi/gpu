import { createTheme } from "@mui/material/styles";
export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#7C3AED",
        light: "#A78BFA",
        dark: "#5B21B6",
      },
      secondary: {
        main: "#06B6D4",
        light: "#67E8F9",
        dark: "#0891B2",
      },
      background: {
        default: mode === "light" ? "#F3F4F6" : "#0F172A",
        paper: mode === "light" ? "#FFFFFF" : "#1E293B",
      },
      text: {
        primary: mode === "light" ? "#1F2937" : "#F8FAFC",
        secondary: mode === "light" ? "#4B5563" : "#94A3B8",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": {
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
          },
          containedPrimary: {
            background: "linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)",
            color: "#fff",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border:
              mode === "light" ? "1px solid #E5E7EB" : "1px solid #334155",
            background: mode === "light" ? "#FFFFFF" : "#1E293B",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
            color: mode === "light" ? "#1F2937" : "#F8FAFC",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
            backgroundImage: "none",
          },
        },
      },
    },
  });
