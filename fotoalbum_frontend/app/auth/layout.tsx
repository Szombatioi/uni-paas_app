"use client";

import { ThemeProvider } from "@emotion/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "../themes/main_theme";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <div className="min-h-screen bg-gray-50">
                            {children}

                        </div>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}