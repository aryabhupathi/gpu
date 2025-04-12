// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>
//         {children}
//       </body>
//     </html>
//   );
// }


import { Inter } from 'next/font/google';
import CssBaseline from '@mui/material/CssBaseline';
import { ReduxProvider } from '@/redux/provider';
import { AuthProvider } from './provider/AuthProvider';
// import theme from '@/lib/theme';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Community Forums',
  description: 'A place to discuss and share ideas with the community',
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
            {/* <ThemeProvider theme={theme}> */}
              <CssBaseline />
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            {/* </ThemeProvider> */}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}