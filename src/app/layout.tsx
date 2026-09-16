import { Inter } from "next/font/google";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "./provider/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { Box } from "@mui/material";
import ThemeProviderClient from "./ThemeProviderClient";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "letstalk",
  description: "A place to discuss and share ideas with the community",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const initialTheme = (themeCookie?.value === "dark" ? "dark" : "light") as
    | "light"
    | "dark";

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <ReduxProvider>
          <AuthProvider>
            <ThemeProviderClient initialTheme={initialTheme}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100vh",
                }}
              >
                <Header />
                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                  <Sidebar sx={{ display: { xs: "none", md: "flex" } }} />

                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "auto",
                      bgcolor: "background.default",
                      width: { xs: "100%", md: "calc(100% - 280px)" },
                    }}
                  >
                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        p: { xs: 2, md: 4 },
                        bgcolor: "background.paper",
                        m: { xs: 1, md: 2 },
                        borderRadius: 4,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      }}
                    >
                      {children}
                    </Box>
                    <Footer />
                  </Box>
                </Box>
              </Box>
            </ThemeProviderClient>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
