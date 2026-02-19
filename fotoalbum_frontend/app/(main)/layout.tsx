"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/layout/navbar";
import { AuthProvider } from "../contexts/auth-context";
import { Theme, ThemeProvider } from "@emotion/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "../themes/main_theme";
import { SnackbarProvider } from "../contexts/snackbar-provider";
import { Box, DialogContent } from "@mui/material";
import { DialogProvider } from "../contexts/dialog-context";
import { LanguageProvider } from "../contexts/LanguageContext";

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
              <LanguageProvider>
                <SnackbarProvider>
                  <DialogProvider>
                    <Navbar />
                    <Box sx={(theme) => theme.mixins.toolbar} />
                    {children}
                  </DialogProvider>
                </SnackbarProvider>
              </LanguageProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html >
  );
}
