"use client";
import { DeleteOutline, InsertDriveFile } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography, Tooltip } from "@mui/material";

export interface ImageListItemProps {
    fileName: string;
    name: string;
    date: Date | string; // Engedjük meg a stringet is!
    action: (fileName: string) => void;
}

export default function ImageListItem({
    fileName,
    name,
    date,
    action
}: ImageListItemProps) {
    
    // 1. Biztonságos dátumkezelés
    const safeDate = new Date(date);
    const isValidDate = !isNaN(safeDate.getTime());

    const formattedDate = isValidDate 
        ? new Intl.DateTimeFormat('hu-HU', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
          }).format(safeDate)
        : "Ismeretlen dátum";

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                border: "1px solid",
                borderColor: "divider", 
                borderRadius: 2,
                padding: 2,
                mb: 1, // Adjunk neki egy kis alsó margót a listában
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    backgroundColor: "action.hover",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                    borderColor: "primary.light",
                },
            }}
        >
            <Box sx={{ 
                mr: 2, 
                display: 'flex', 
                alignItems: 'center', 
                color: 'primary.main',
                bgcolor: 'primary.light',
                p: 1,
                borderRadius: 1,
                flexShrink: 0 // Ne nyomódjon össze az ikon
            }}>
                <InsertDriveFile />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography 
                    variant="subtitle1" 
                    fontWeight="600" 
                    noWrap 
                    sx={{ color: "text.primary", lineHeight: 1.2 }}
                >
                    {name}
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{ color: "text.secondary", display: "block" }}
                >
                    {formattedDate} • <small style={{ opacity: 0.7 }}>{fileName}</small>
                </Typography>
            </Box>

            <Tooltip title="Törlés">
                <IconButton 
                    onClick={() => action(fileName)}
                    size="small"
                    sx={{ 
                        ml: 1,
                        color: "text.disabled",
                        "&:hover": { color: "error.main", bgcolor: "error.lighter" } 
                    }}
                >
                    <DeleteOutline fontSize="small" />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}