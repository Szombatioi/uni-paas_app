"use client";
import {
    Dialog,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface ImageViewerProps {
    open: boolean;
    url: string;
    onClose: () => void;
}

export default function ImageViewerDialog({ open, url, onClose }: ImageViewerProps) {
    const { t } = useTranslation("common");
    console.log(url)
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth={false}
            // This removes the white background and shadow of the dialog box itself
            PaperProps={{
                sx: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    width: '95vw',
                    height: '95vh',
                    m: 0,
                    maxWidth: 'none',
                    overflow: 'visible' // Allows the close button to sit slightly outside if needed
                }
            }}
            // This ensures the backdrop (the area outside the image) is darkened
            slotProps={{
                backdrop: {
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.85)' }
                }
            }}
            onClick={onClose}
        >
            {/* Close Button */}
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'white',
                    zIndex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    p: 0, 
                    overflow: 'hidden' 
                }}
            >
                <img 
                    src={url} 
                    alt="image" 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        // Optional: add a subtle drop shadow to the image so it doesn't get lost
                        filter: 'drop-shadow(0px 0px 20px rgba(0,0,0,0.5))'
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}