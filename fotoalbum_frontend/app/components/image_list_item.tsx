"use client";
import { Delete } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";

export interface ImageListItemProps {
    fileName: string; //This is the unique ID
    name: string;
    date: Date;
    action: (fileName: string) => void;
}

export default function ImageListItem({
    fileName,
    name,
    date,
    action
}: ImageListItemProps) {
    return (
        <>
            <Paper elevation={0} sx={{ 
                border: "1px solid black", 
                paddingX: 1, 
                paddingY: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Typography variant="h6">{name}</Typography>

                <IconButton onClick={() => { action(fileName); }}>
                    <Delete />
                </IconButton>
            </Paper>
        </>
    );
}