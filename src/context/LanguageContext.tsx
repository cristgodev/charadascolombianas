import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language, TranslationKey } from '../i18n/translations';
import * as Localization from 'expo-localization'; // Optional: to detect system language

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey, ...args: (string | number)[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('es'); // Default to Spanish

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const storedLang = await AsyncStorage.getItem('app_language');
            if (storedLang) {
                setLanguageState(storedLang as Language);
            } else {
                // Could detect system language here
                // const locale = Localization.getLocales()[0].languageCode;
                // if (locale === 'en') setLanguageState('en');
            }
        } catch (e) {
            console.error("Error loading language", e);
        }
    };

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await AsyncStorage.setItem('app_language', lang);
    };

    const t = (key: TranslationKey, ...args: (string | number)[]) => {
        let text = translations[language][key] || key;

        // Simple interpolation {0}, {1}...
        args.forEach((arg, index) => {
            text = text.replace(`{${index}}`, String(arg));
        });

        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
