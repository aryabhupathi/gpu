import { Inter } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "./provider/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
