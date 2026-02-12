import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface SearchHistoryStoreType {
    searches: string[];
    addSearch: (search: string) => void;
    clearSearches: () => void;
};


const MAX_HISTORY = 5;
export const useSearchHistoryStore = create<SearchHistoryStoreType>()(
    persist(
        (set, get) => ({
            searches: [],

            addSearch: (search: string) => {
                if (search.length < 3) return;
                const trimmed = search.trim();
                if (!trimmed) return;
                const current = get().searches;
                const updated = [trimmed, ...current.filter(item => item !== trimmed)].slice(0, MAX_HISTORY);
                set({ searches: updated });
            },
            clearSearches: () => { set({ searches: [] }); }
        }),
        {
            name: "search-history",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)