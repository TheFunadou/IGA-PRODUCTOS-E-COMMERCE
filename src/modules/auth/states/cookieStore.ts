import { create } from "zustand";
import { persist } from "zustand/middleware";

type CookieState = {
    cookieConsent: boolean;
    setCookieConsent: (value: boolean) => void;
};

export const useCookieStore = create<CookieState>()(
    persist(
        (set) => ({
            cookieConsent: false,
            setCookieConsent: (value) => set({ cookieConsent: value }),
        }),
        {
            name: "cookie-consent-storage",
        }
    )
);