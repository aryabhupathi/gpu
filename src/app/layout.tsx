

import { Inter } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "./provider/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Box } from "@mui/material"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Community Forums",
  description: "A place to discuss and share ideas with the community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh", 
              }}
            >
              <Header />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                }}
              >
                {children}
              </Box>
              <Footer />
            </Box>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
