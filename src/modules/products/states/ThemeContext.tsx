
// Context api

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Se tipa el customHook con las funciones y datos que contiene

type ThemeType = "ligth" | "dark";

const Theme = {
    ligth: "bg-base-300 bg-gradient-to-t from-bg-base-300 to-blue-900 bg-[length:100%_500px] bg-no-repeat",
    dark: "bg-slate-900 bg-gradient-to-t from-bg-slate-900 to-blue-900 bg-[length:100%_500px] bg-no-repeat"
};

type ThemeContextTheme = {
    theme: string;
    currentTheme: ThemeType;
    changeTheme: (key: ThemeType) => void;
};

// Crear contexto
const ThemeContext = createContext<ThemeContextTheme | undefined>(undefined);


// Crear provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<string>(Theme["ligth"]);
    const [currentTheme,setCurrentTheme] = useState<ThemeType>("ligth");

    const changeTheme = (key: ThemeType) => {
        setCurrentTheme(key);
        setTheme(Theme[key]);
    };

    return (
        <ThemeContext.Provider value={{currentTheme, theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext debe usarse dentro de un ThemeProvider");
    }

    return context;
}