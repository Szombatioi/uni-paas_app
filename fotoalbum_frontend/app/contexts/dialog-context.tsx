"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface DialogContextType {
  showDialog: (dialog: ReactNode) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
};

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<ReactNode | null>(null);

  const showDialog = useCallback((node: ReactNode) => {
    setDialog(node);
  }, []);

  const hideDialog = useCallback(() => {
    setDialog(null);
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {dialog}
    </DialogContext.Provider>
  );
};
