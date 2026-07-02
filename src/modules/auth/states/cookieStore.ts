import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ConsentStatus = "accepted" | "rejected" | null;

type CookieState = {
    consentStatus: ConsentStatus;
    hasAdvertisingConsent: boolean;
    setConsentStatus: (status: "accepted" | "rejected") => void;
};

export const useCookieStore = create<CookieState>()(
    persist(
        (set) => ({
            consentStatus: null,
            hasAdvertisingConsent: false,
            setConsentStatus: (status) =>
                set({
                    consentStatus: status,
                    hasAdvertisingConsent: status === "accepted",
                }),
        }),
        {
            name: "iga-cookie-consent",
            storage: createJSONStorage(() => localStorage),
            // Migrate from old boolean shape (cookieConsent) to new shape
            migrate: (persisted: any) => {
                if (persisted && typeof persisted.cookieConsent === "boolean") {
                    const status: ConsentStatus = persisted.cookieConsent ? "accepted" : null;
                    return {
                        consentStatus: status,
                        hasAdvertisingConsent: status === "accepted",
                    };
                }
                return persisted;
            },
            version: 1,
        }
    )
);