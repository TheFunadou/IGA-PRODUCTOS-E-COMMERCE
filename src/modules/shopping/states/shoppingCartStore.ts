// stores/shoppingCartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import type { ShoppingCartType } from "../ShoppingTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { addItemService, checkAllService, clearCartService, getShoppingCartService, removeItemService, syncShoppingCartService, tooggleCheckService, uncheckAllService, updateItemQty } from "../services/ShoppingServices";
import { getErrorMessage } from "../../../global/GlobalUtils";

type ShoppingCartState = {
    items: ShoppingCartType[];
    isLoading: boolean;
    itemBuyNow: ShoppingCartType | null;
    error: string | null;
    getShoppingCart: () => Promise<void>;
    addItem: (data: ShoppingCartType) => Promise<boolean>;
    addToBuyNow: (data: ShoppingCartType) => Promise<boolean>;
    removeItem: (sku: string) => Promise<void>;
    clearShoppingCart: () => Promise<void>;
    updateItemQty: (sku: string, quantity: number) => Promise<void>;
    toogleCheckItem: (sku: string) => void;
    checkAllItems: () => void;
    uncheckAllItems: () => void;
    setItemFavorite: (sku: string, favorite: boolean | undefined) => Promise<void>;
    _backendSync: () => Promise<void>;
};

export const useShoppingCartStore = create<ShoppingCartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            itemBuyNow: null,
            error: null,

            getShoppingCart: async () => {
                const { isAuth } = useAuthStore.getState();
                if (isAuth) {
                    const shoppingCart: ShoppingCartType[] | null = await getShoppingCartService();
                    if (shoppingCart) set({ items: shoppingCart })
                }
            },

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

                try {
                    set({ isLoading: true })
                    const shoppingCart: ShoppingCartType[] = await addItemService(data);
                    set({ items: shoppingCart });
                    return true;
                } catch (error) {
                    console.error(error);
                    set({ error: getErrorMessage(error) })
                    return false;
                } finally {
                    set({ isLoading: false })
                }
            },


            addToBuyNow: async (data) => {
                set({ itemBuyNow: { ...data } });
                return true;
            },

            removeItem: async (sku) => {
                const { isAuth } = useAuthStore.getState();

                if (isAuth) {
                    try {
                        set({ isLoading: true });
                        const shoppingCart: ShoppingCartType[] = await removeItemService(sku);
                        set({ items: shoppingCart });
                    } catch (error) {
                        set({ error: getErrorMessage(error) });
                    } finally {
                        set({ isLoading: false });
                    };
                } else {
                    set({
                        items: get().items.filter(
                            (i) => i.product_version.sku !== sku
                        ),
                    });
                }
            },

            clearShoppingCart: async () => {
                if (get().items.length > 0) {
                    const { isAuth } = useAuthStore.getState();

                    if (isAuth) {
                        try {
                            set({ isLoading: true });
                            const removed: boolean = await clearCartService();
                            if (!removed) alert("Error al borrar los productos del carrito");
                            set({ items: [] });
                        } catch (error) {
                            set({ error: getErrorMessage(error) })
                        } finally {
                            set({ isLoading: false });
                        }
                    };

                    set({ items: [] });
                };
            },

            updateItemQty: async (sku, quantity) => {
                const { isAuth } = useAuthStore.getState();
                if (isAuth) {
                    try {
                        set({ isLoading: true });
                        const updated: ShoppingCartType[] = await updateItemQty({ sku, newQuantity: quantity });
                        set({ items: updated });
                    } catch (error) {
                        set({ error: getErrorMessage(error) });
                    } finally {
                        set({ isLoading: false });
                    };
                } else {
                    set({
                        items: get().items.map((i) =>
                            i.product_version.sku === sku ? { ...i, quantity } : i
                        ),
                    });
                }
            },

            toogleCheckItem: async (sku) => {
                const { isAuth } = useAuthStore.getState();
                if (isAuth) {
                    try {
                        set({ isLoading: true });
                        const updated: ShoppingCartType[] = await tooggleCheckService(sku);
                        set({ items: updated });
                    } catch (error) {
                        set({ error: getErrorMessage(error) });
                    } finally {
                        set({ isLoading: false });
                    }
                } else {
                    set({
                        items: get().items.map((i) =>
                            i.product_version.sku === sku
                                ? { ...i, isChecked: !i.isChecked }
                                : i
                        ),
                    });
                }
            },

            checkAllItems: async () => {
                if (get().items.length > 0) {
                    const { isAuth } = useAuthStore.getState();
                    if (isAuth) {
                        try {
                            set({ isLoading: true });
                            const updated: ShoppingCartType[] = await checkAllService();
                            set({ items: updated });
                        } catch (error) {
                            set({ error: getErrorMessage(error) });
                        } finally {
                            set({ isLoading: false });
                        }
                    } else {
                        set({
                            items: get().items.map((i) => ({ ...i, isChecked: true })),
                        });
                    }
                }
            },

            uncheckAllItems: async () => {
                if (get().items.length > 0) {
                    const { isAuth } = useAuthStore.getState();
                    if (isAuth) {
                        try {
                            set({ isLoading: true });
                            const updated: ShoppingCartType[] = await uncheckAllService();
                            set({ items: updated });
                        } catch (error) {
                            set({ error: getErrorMessage(error) });
                        } finally {
                            set({ isLoading: true });
                        }
                    } else {
                        set({
                            items: get().items.map((i) => ({ ...i, isChecked: false })),
                        });
                    };
                };
            },

            setItemFavorite: async (sku, favorite) => {
                const { isAuth } = useAuthStore.getState();

                if (isAuth) {
                    await axios.put(`/api/cart/favorite/${sku}`, { favorite });
                    await get()._backendSync();
                } else {
                    set({
                        items: get().items.map((i) =>
                            i.product_version.sku === sku ? { ...i, isFavorite: favorite } : i
                        ),
                    });
                }
            },

            _backendSync: async () => {
                const { isAuth } = useAuthStore.getState();
                if (!isAuth) return;

                set({ isLoading: true });
                try {
                    const { data } = await axios.get<ShoppingCartType[]>("/api/cart");
                    set({ items: data });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: "shopping-cart",
            // storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                // solo persistir el carrito y no `isLoading`
                items: state.items,
                itemBuyNow: state.itemBuyNow,
            }),
        }
    )
);
