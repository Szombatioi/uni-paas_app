"use client";
import { useAuth } from "@/app/contexts/auth-context";
import { logout } from "@/axios/auth-functions";
import { Login, Logout, VpnKey } from "@mui/icons-material";
import { AppBar, Box, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Navbar() {
    const router = useRouter();
    const { t } = useTranslation("common");
    const { user } = useAuth();

    return (
        <AppBar elevation={1} sx={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", py: 1 }}>
            <div />

            <Typography variant="h3" align="center" sx={{ textShadow: '1px 1px 0 #000' }}>
                {t("title")}
            </Typography>
            {/* Account part */}
            {!!user ? (
                <>
                <Tooltip title={t("logout")}>
                    <IconButton sx={{ marginRight: 1 }} onClick={() => { logout(); router.replace("/") /*router.replace("/auth/login");*/ }}>
                        <Logout htmlColor="#fff" />
                    </IconButton>
                    </Tooltip>
                </>
            ) : (
                <>
                    <Tooltip title={t("login")}>
                        <IconButton sx={{ marginRight: 1 }} onClick={() => { router.replace("/auth/login") /*router.replace("/auth/login");*/ }}>
                        <VpnKey htmlColor="#fff" />
                    </IconButton>
                    </Tooltip>
                </>
            )}
        </AppBar>
    );
}