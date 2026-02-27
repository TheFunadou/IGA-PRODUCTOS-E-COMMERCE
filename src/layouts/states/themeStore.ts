import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";



interface ThemStoreType {
    theme: "ligth" | "dark" | null;
    setTheme: (theme: "ligth" | "dark") => void;
};

export const THEME_KEY = "theme";

export const useThemeStore = create<ThemStoreType>()(
    persist(
        (set) => ({
            theme: null,
            setTheme: (theme: "ligth" | "dark") => set({ theme })
        }),
        {
            name: THEME_KEY,
            storage: createJSONStorage(() => localStorage),
        }
    )
);