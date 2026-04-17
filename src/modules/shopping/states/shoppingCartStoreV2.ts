// stores/shoppingCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShoppingCartI } from "../ShoppingTypes";
import { checkAll, clearCart, removeItem, setItem, toggleCheck, uncheckAll } from "../services/ShoppingCartService";
import { formatAxiosError } from "../../../api/helpers";

type ShoppingCartState = {
    items: ShoppingCartI[];
    isLoading: boolean;
    error: string | null;
    setItem: (item: ShoppingCartI) => Promise<void>;
    removeItem: (sku: string) => Promise<void>;
    clearShoppingCart: () => Promise<void>;
    toogleCheckItem: (sku: string) => void;
    checkAllItems: () => void;
    uncheckAllItems: () => void;
};

export const useShoppingCartStore = create<ShoppingCartState>()(
    persist(
        (set) => ({
            items: [],
            isLoading: false,
            error: null,

            setItem: async (item) => {
                set({ isLoading: true });
                try {
                    const response = await setItem({ item });
                    set({ items: response, isLoading: false });
                } catch (error) {
                    set({ error: formatAxiosError(error), isLoading: false });
                }
            },

            removeItem: async (sku) => {
                set({ isLoading: true })
                try {
                    const response = await removeItem({ sku });
                    set({ items: response, isLoading: false });
                } catch (error) {
                    set({ error: formatAxiosError(error), isLoading: false });
                }
            },

            clearShoppingCart: async () => {
                set({ isLoading: true })
                try {
                    const response = await clearCart();
                    set({ items: response, isLoading: false });
                } catch (error) {
                    set({ error: formatAxiosError(error), isLoading: false });
                }
            },

            toogleCheckItem: async (sku) => {
                set({ isLoading: true })
                try {
                    const response = await toggleCheck({ sku });
                    set({ items: response, isLoading: false });
                } catch (error) {
                    set({ error: formatAxiosError(error), isLoading: false });
                }
            },

            checkAllItems: async () => {
                set({ isLoading: true })
                try {
                    const response = await checkAll();
                    set({ items: response, isLoading: false });
                } catch (error) {
                    set({ error: formatAxiosError(error), isLoading: false });
                }
            },

            uncheckAllItems: async () => {
                set({ isLoading: true })
                try {
                    const response = await uncheckAll();
                    set({ items: response, isLoading: false });
                } catch (error) {
                    set({ error: formatAxiosError(error), isLoading: false });
                }
            },
        }),
        {
            name: "shopping-cart",
            partialize: (state) => ({
                items: state.items,
            }),
        }
    )
);
