// stores/shoppingCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShoppingCartType } from "../ShoppingTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { getShoppingCartService } from "../services/ShoppingServices";

type ShoppingCartState = {
    items: ShoppingCartType[];
    isLoading: boolean;
    itemBuyNow: ShoppingCartType | null;
    error: string | null;
    addItem: (data: ShoppingCartType) => Promise<boolean>;
    addToBuyNow: (data: ShoppingCartType) => Promise<boolean>;
    removeItem: (sku: string) => Promise<void>;
    clearShoppingCart: () => Promise<void>;
    updateItemQty: (sku: string, quantity: number) => Promise<void>;
    toogleCheckItem: (sku: string) => void;
    checkAllItems: () => void;
    uncheckAllItems: () => void;
    setItemFavorite: (sku: string, favorite: boolean | undefined) => Promise<void>;
};

export const useShoppingCartStore = create<ShoppingCartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            itemBuyNow: null,
            error: null,

            addItem: async (data) => {
                const { isAuth } = useAuthStore.getState();
                if (!isAuth) {
                    const exists = get().items.find(
                        (i) => i.product_version.sku === data.product_version.sku
                    );
                    if (exists) {
                        set({
                            items: get().items.map((i) =>
                                i.product_version.sku === data.product_version.sku
                                    ? { ...i, quantity: (i.quantity + data.quantity) > i.product_version.stock ? i.product_version.stock : i.quantity + data.quantity }
                                    : i
                            ),
                        });
                        return true;
                    } else {
                        set({ items: [...get().items, { ...data }] });
                        return true;
                    }
                };
                return true;
            },


            addToBuyNow: async (data) => {
                set({ itemBuyNow: { ...data } });
                return true;
            },

            removeItem: async (sku) => {
                set({
                    items: get().items.filter(
                        (i) => i.product_version.sku !== sku
                    ),
                });
            },

            clearShoppingCart: async () => { if (get().items.length > 0) set({ items: [] }); },

            updateItemQty: async (sku, quantity) => {
                set({
                    items: get().items.map((i) =>
                        i.product_version.sku === sku ? { ...i, quantity } : i
                    ),
                });
            },

            toogleCheckItem: async (sku) => {
                set({
                    items: get().items.map((i) =>
                        i.product_version.sku === sku
                            ? { ...i, isChecked: !i.isChecked }
                            : i
                    ),
                });
            },

            checkAllItems: async () => {
                if (get().items.length > 0) {
                    set({
                        items: get().items.map((i) => ({ ...i, isChecked: true })),
                    });
                }
            },

            uncheckAllItems: async () => {
                if (get().items.length > 0) {
                    set({
                        items: get().items.map((i) => ({ ...i, isChecked: false })),
                    });
                };
            },

            setItemFavorite: async (sku, favorite) => {
                set({
                    items: get().items.map((i) =>
                        i.product_version.sku === sku ? { ...i, isFavorite: favorite } : i
                    ),
                });
            }
        }),
        {
            name: "shopping-cart",
            partialize: (state) => ({
                items: state.items,
                itemBuyNow: state.itemBuyNow,
            }),
        }
    )
);
