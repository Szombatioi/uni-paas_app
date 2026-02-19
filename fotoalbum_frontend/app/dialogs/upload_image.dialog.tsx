"use client";
import { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (file: File) => void;
}

export default function UploadDialog({ open, onClose, onSubmit }: UploadDialogProps) {
    const { t } = useTranslation("common");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onSubmit(selectedFile);
            setSelectedFile(null);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography align="center" variant="h4" component="h2">
                    {t("upload_image")}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                    {/* File selector */}
                    <Button variant="contained" component="label">
                        {t("select_file")}
                        <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={handleFileChange} />
                    </Button>

                    {/* Selected file name */}
                    {selectedFile && (
                        <Typography noWrap>
                            {selectedFile.name}
                        </Typography>
                    )}

                    {/* Remove button */}
                    {selectedFile && (
                        <IconButton onClick={handleRemoveFile} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>{t("cancel")}</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!selectedFile}
                >
                    {t("upload")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
