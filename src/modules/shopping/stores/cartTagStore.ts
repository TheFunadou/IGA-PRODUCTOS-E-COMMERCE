import { create } from "zustand";

interface TagCount {
    tag: string;
    count: number;
}

interface CartTagState {
    tagCounts: TagCount[];
    addTags: (tags: string[]) => void;
    resetTags: () => void;
    getTopTags: (limit?: number) => string[];
}

export const useCartTagStore = create<CartTagState>((set, get) => ({
    tagCounts: [],

    addTags: (tags: string[]) => {
        if (tags.length === 0) return;
        const normalized = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);

        set((state) => {
            const map = new Map(state.tagCounts.map((tc) => [tc.tag, tc.count]));

            for (const tag of normalized) {
                map.set(tag, (map.get(tag) ?? 0) + 1);
            }

            const tagCounts = Array.from(map.entries())
                .map(([tag, count]) => ({ tag, count }))
                .sort((a, b) => b.count - a.count);

            return { tagCounts };
        });
    },

    resetTags: () => set({ tagCounts: [] }),

    getTopTags: (limit = 5) => {
        return get()
            .tagCounts.slice(0, limit)
            .map((tc) => tc.tag);
    },
}));
