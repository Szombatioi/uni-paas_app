"use client";
import { useState, useEffect, useRef } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    IconButton,
    Typography,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (file: File, name: string) => void;
}

export default function UploadDialog({ open, onClose, onSubmit }: UploadDialogProps) {
    const { t } = useTranslation("common");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string>("");

    // Update editable filename when a new file is selected
    useEffect(() => {
        if (selectedFile) {
            // Remove extension for editing
            const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
            setFileName(nameWithoutExt);
        } else {
            setFileName("");
        }
    }, [selectedFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileName("");
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // reset input so same file can trigger onChange
        }
    };

    const handleSubmit = () => {
        if (selectedFile && fileName.trim()) {
            onSubmit(selectedFile, fileName.trim());
            setSelectedFile(null);
            setFileName("");
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle align="center">{t("upload_image")}</DialogTitle>

            <DialogContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
                    {/* File selector */}
                    <Button variant="contained" component="label">
                        {t("select_file")}
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            hidden
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </Button>

                    {/* Editable filename */}
                    {selectedFile && (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <TextField
                                size="small"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                error={fileName.length > 40}
                            />

                            {fileName.length > 40 && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ mt: 0.5 }}
                                >
                                    {t("filename_max_40")}
                                </Typography>
                            )}
                        </Box>
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
                    disabled={!selectedFile || !fileName.trim() || fileName.length > 40}
                >
                    {t("upload")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
