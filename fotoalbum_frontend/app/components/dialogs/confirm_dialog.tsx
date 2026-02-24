"use client";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    mainText: string;
    cancelLabel?: string;
    proceedLabel?: string;
    onClose: () => void;
    onConfirm: () => void;
    severity?: "primary" | "error"; // Allows for "Delete" vs "Save" styling
}

export default function ConfirmDialog({
    open,
    title,
    mainText,
    cancelLabel = "Cancel",
    proceedLabel = "Confirm",
    onClose,
    onConfirm,
    severity = "primary"
}: ConfirmDialogProps) {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            aria-labelledby="confirm-dialog-title"
        >
            <DialogTitle id="confirm-dialog-title">
                {title}
            </DialogTitle>
            
            <DialogContent>
                <DialogContentText>
                    {mainText}
                </DialogContentText>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    {cancelLabel}
                </Button>
                <Button 
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }} 
                    variant="contained" 
                    color={severity === "error" ? "error" : "primary"}
                    autoFocus
                >
                    {proceedLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}