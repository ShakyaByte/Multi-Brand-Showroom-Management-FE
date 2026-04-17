"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
// import { applyTheme, loadSavedTheme, clearTheme } from "@/shared/utils/theme-manager";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // ✅ No localStorage/window access during SSR — start with undefined, resolve in useEffect
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        // This runs only on the client
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? "dark" : "light");
        }
    }, []);

    // useEffect(() => {
    //     if (!theme) return;
    //     const root = window.document.documentElement;
    //     root.classList.remove("light", "dark");
    //     root.classList.add(theme);          // ← add class FIRST
    //     localStorage.setItem("theme", theme);

    //     if (theme === "light") {
    //         const saved = loadSavedTheme();
    //         applyTheme(saved);              
    //     } else {
    //         // When in dark mode, remove the light-specific inline CSS variables
    //         // to prevent them from overriding the dark theme's global CSS defaults.
    //         clearTheme();
    //     }
    // }, [theme]);    

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}