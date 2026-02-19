"use client";

import { createContext, useContext, useEffect, useState } from "react";
import i18n from "../i18n";
import api from "../../axios/axios";
import { Severity, useSnackbar } from "./snackbar-provider";
import { useTranslation } from "react-i18next";

export type Language = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "hu",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("hu");
  const {showMessage} = useSnackbar();
  const {t} = useTranslation("common");

  useEffect(() => {
    setLanguage("hu")
  }, []);


  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
