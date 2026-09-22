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
            setTheme: (theme) => {
                // Escribe el atributo de forma síncrona para que el cambio sea inmediato,
                // sin esperar el commit de render de React. Normaliza "ligth" -> "light" para daisyUI.
                document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
                set({ theme });
            }
        }),
        {
            name: THEME_KEY,
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Aplica el tema persistido antes del primer paint para evitar un destello al recargar en modo oscuro
const persistedTheme = useThemeStore.getState().theme;
if (persistedTheme) {
    document.documentElement.dataset.theme = persistedTheme === "dark" ? "dark" : "light";
}