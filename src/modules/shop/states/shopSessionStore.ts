import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CategoryType } from "../../categories/CategoriesTypes";
import type { PV3Sort, colorLine } from "../../products/ProductTypes";

/**
 * Estado de la tienda que debe sobrevivir a la navegación al detalle de un
 * producto (y a una recarga de la pestaña).
 *
 * Se guarda en `sessionStorage` porque es estado de navegación del usuario:
 * - sobrevive recargas dentro de la misma pestaña
 * - se limpia al cerrar la pestaña
 * - no se comparte entre pestañas
 */
export interface ShopSessionData {
    selectedCategory?: CategoryType;
    currentPage: number;
    sorts: PV3Sort;
    favoriteCheck: boolean;
    offerCheck: boolean;
    stockCheck: boolean;
    ratingFilter?: number;
    colorLineFilter?: colorLine;
    skuFilter?: string[];
    localPriceRange: { min: string; max: string };
    priceRange?: { min: number; max: number };
    pendingTagIds: string[];
    tagNameFilter: string[];
}

const initialData: ShopSessionData = {
    selectedCategory: undefined,
    currentPage: 1,
    sorts: {},
    favoriteCheck: false,
    offerCheck: false,
    stockCheck: false,
    ratingFilter: undefined,
    colorLineFilter: undefined,
    skuFilter: undefined,
    localPriceRange: { min: "", max: "" },
    priceRange: undefined,
    pendingTagIds: [],
    tagNameFilter: [],
};

interface ShopSessionStore extends ShopSessionData {
    /** Actualiza de forma parcial el estado de la tienda. */
    patch: (partial: Partial<ShopSessionData>) => void;
    /** Restaura la tienda a su estado por defecto (filtros, categoría y página). */
    reset: () => void;
}

export const SHOP_SESSION_KEY = "shop:session:v1";

export const useShopSessionStore = create<ShopSessionStore>()(
    persist(
        (set) => ({
            ...initialData,
            patch: (partial) => set(partial),
            reset: () => set(initialData),
        }),
        {
            name: SHOP_SESSION_KEY,
            version: 1,
            storage: createJSONStorage(() => sessionStorage),
            // Solo se persisten los datos; las acciones se reconstruyen al hidratar.
            partialize: (state) => ({
                selectedCategory: state.selectedCategory,
                currentPage: state.currentPage,
                sorts: state.sorts,
                favoriteCheck: state.favoriteCheck,
                offerCheck: state.offerCheck,
                stockCheck: state.stockCheck,
                ratingFilter: state.ratingFilter,
                colorLineFilter: state.colorLineFilter,
                skuFilter: state.skuFilter,
                localPriceRange: state.localPriceRange,
                priceRange: state.priceRange,
                pendingTagIds: state.pendingTagIds,
                tagNameFilter: state.tagNameFilter,
            }),
        }
    )
);
