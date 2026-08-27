import { create } from "zustand";

interface ShopExternalTagsStoreType {
    pendingTagNames: string[] | null;
    requestTagFilter: (tagNames: string[]) => void;
    consumeTagRequest: () => void;
}

export const useShopExternalTagsStore = create<ShopExternalTagsStoreType>()((set) => ({
    pendingTagNames: null,

    requestTagFilter: (tagNames: string[]) => {
        const list = tagNames.map((name) => name.trim()).filter(Boolean);
        if (list.length === 0) return;
        set({ pendingTagNames: list });
    },

    consumeTagRequest: () => { set({ pendingTagNames: null }); },
}));
