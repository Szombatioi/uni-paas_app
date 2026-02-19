"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/layout/navbar";
import { AuthProvider } from "../contexts/auth-context";
import { Theme, ThemeProvider } from "@emotion/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "../themes/main_theme";
import { SnackbarProvider } from "../contexts/snackbar-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
        style={{ margin: 0 }}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <SnackbarProvider>
                <Navbar />
                {children}
              </SnackbarProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
