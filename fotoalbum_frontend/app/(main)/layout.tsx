import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/layout/navbar";
import { AuthProvider } from "../contexts/auth-context";
import { Theme, ThemeProvider } from "@emotion/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "../themes/main_theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fotóalbum",
  description: "BME MSc III. Felhőalapú elosztott rendszerek laboratórium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{margin: 0}}
      >
        <AppRouterCacheProvider>
           <ThemeProvider theme={theme}>
        <AuthProvider>
          <Navbar />
        {children}
        </AuthProvider>
        </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
