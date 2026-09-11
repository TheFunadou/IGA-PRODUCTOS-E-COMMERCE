import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_RECENT_SKUS = 4;
const TAB_SESSION_ID_KEY = "tab-session-id";

export const getTabSessionId = (): string => {
    const existing = sessionStorage.getItem(TAB_SESSION_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(TAB_SESSION_ID_KEY, id);
    return id;
};

interface RecentlyViewedStoreType {
    ownerId: string | null;
    skus: string[];
    addSku: (sku: string, ownerId: string) => void;
    clearSkus: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStoreType>()(
    persist(
        (set, get) => ({
            ownerId: null,
            skus: [],

            addSku: (sku: string, ownerId: string) => {
                const normalized = sku.toUpperCase();
                if (!normalized) return;
                const current = get();
                const skus = current.ownerId !== ownerId
                    ? [normalized]
                    : [normalized, ...current.skus.filter(item => item.toUpperCase() !== normalized)].slice(0, MAX_RECENT_SKUS);
                set({ ownerId, skus });
            },

            clearSkus: () => { set({ skus: [] }); },
        }),
        {
            name: "recently-viewed",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);