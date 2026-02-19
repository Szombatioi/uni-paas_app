"use client";
import { logout } from "@/axios/auth-functions";
import { Logout } from "@mui/icons-material";
import { AppBar, Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Navbar() {
    const router = useRouter();
    const { t } = useTranslation("common");
    return (
        <AppBar elevation={1} sx={{display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", py: 1}}>
            <div />

            <Typography variant="h3" align="center" sx={{textShadow: '1px 1px 0 #000'}}>
                {t("title")}
            </Typography>

            {/* Account part */}
            <IconButton sx={{marginRight: 1}} onClick={() => {logout(); router.replace("/auth/login");}}>
                <Logout htmlColor="#fff" />
            </IconButton>
        </AppBar>
    );
}