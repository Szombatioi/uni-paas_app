import { logout } from "@/axios/auth-functions";
import { Logout } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    return (
        <Box sx={{border: '1px solid red', display: "flex", justifyContent: "space-between"}}>
            <div />

            <Typography variant="h3" align="center">
                Fotóalbum
            </Typography>

            {/* Account part */}
            <IconButton onClick={() => {logout(); router.replace("/auth/login");}}>
                <Logout />
            </IconButton>
        </Box>
    );
}