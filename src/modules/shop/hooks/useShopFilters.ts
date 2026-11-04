import { useCallback, useMemo, type Dispatch, type SetStateAction } from "react";
import useDebounce from "../../../global/hooks/useDebounce";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import type { colorLine, PV3SortField } from "../../products/ProductTypes";
import { useShopSessionStore } from "../states/shopSessionStore";

export type SortDirection = "asc" | "desc";

const TAG_DEBOUNCE_MS = 1000;

export function useShopFilters() {
    const sorts = useShopSessionStore((s) => s.sorts);
    const favoriteCheck = useShopSessionStore((s) => s.favoriteCheck);
    const offerCheck = useShopSessionStore((s) => s.offerCheck);
    const stockCheck = useShopSessionStore((s) => s.stockCheck);
    const ratingFilter = useShopSessionStore((s) => s.ratingFilter);
    const colorLineFilter = useShopSessionStore((s) => s.colorLineFilter);
    const skuFilter = useShopSessionStore((s) => s.skuFilter);
    const localPriceRange = useShopSessionStore((s) => s.localPriceRange);
    const priceRange = useShopSessionStore((s) => s.priceRange);
    const pendingTagIds = useShopSessionStore((s) => s.pendingTagIds);
    const tagNameFilter = useShopSessionStore((s) => s.tagNameFilter);
    const patch = useShopSessionStore((s) => s.patch);

    // Tags: selección inmediata en UI (pending) + consulta diferida 1000ms
    const debouncedTagIds = useDebounce(pendingTagIds, TAG_DEBOUNCE_MS);
    const isTagDebouncing = JSON.stringify(pendingTagIds) !== JSON.stringify(debouncedTagIds);

    /** Mantiene la firma de `useState` para los inputs de precio (valores y updater). */
    const setLocalPriceRange: Dispatch<SetStateAction<{ min: string; max: string }>> = useCallback(
        (value) => {
            const prev = useShopSessionStore.getState().localPriceRange;
            const next = typeof value === "function" ? value(prev) : value;
            patch({ localPriceRange: next });
        },
        [patch]
    );

    const setSortDirection = useCallback((field: PV3SortField, dir?: SortDirection) => {
        const prev = useShopSessionStore.getState().sorts;
        if (!dir) {
            if (!(field in prev)) return;
            const next = { ...prev };
            delete next[field];
            patch({ sorts: next });
            return;
        }
        if (prev[field] === dir) return;
        patch({ sorts: { ...prev, [field]: dir } });
    }, [patch]);

    const setFavoriteFilter = useDebounceCallback((checked: boolean) => {
        patch({ favoriteCheck: checked });
    }, 250);

    const setOfferFilter = useDebounceCallback((checked: boolean) => {
        patch({ offerCheck: checked });
    }, 250);

    const setStockFilter = useDebounceCallback((checked: boolean) => {
        patch({ stockCheck: checked });
    }, 250);

    const setRating = useDebounceCallback((rating?: number) => {
        patch({ ratingFilter: rating });
    }, 250);

    const setColorLine = useDebounceCallback((value: string) => {
        const val = value === "" ? undefined : (value as colorLine);
        patch({ colorLineFilter: val });
    }, 250);

    const setSkuFilter = useDebounceCallback((skus?: string[]) => {
        patch({ skuFilter: skus && skus.length > 0 ? skus : undefined });
    }, 250);

    const applyPriceRange = useCallback(() => {
        const min = localPriceRange.min ? parseFloat(localPriceRange.min) : undefined;
        const max = localPriceRange.max ? parseFloat(localPriceRange.max) : undefined;
        if (!min && !max) {
            patch({ priceRange: undefined });
            return;
        }
        if (priceRange && priceRange.min === min && priceRange.max === max) return;
        patch({ priceRange: { min: min ?? 0, max: max ?? 0 } });
    }, [localPriceRange, priceRange, patch]);

    const clearPriceRange = useCallback(() => {
        patch({ localPriceRange: { min: "", max: "" }, priceRange: undefined });
    }, [patch]);

    const toggleTag = useCallback((tagId: string) => {
        const prev = useShopSessionStore.getState().pendingTagIds;
        patch({
            pendingTagIds: prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId],
        });
    }, [patch]);

    const clearTags = useCallback(() => {
        patch({ pendingTagIds: [] });
    }, [patch]);

    /** Reemplaza los ids de tag sin pasar por el debounce (poda de datos restaurados). */
    const replaceTags = useCallback((tagIds: string[]) => {
        const prev = useShopSessionStore.getState().pendingTagIds;
        if (prev.length === tagIds.length && prev.every((id) => tagIds.includes(id))) return;
        patch({ pendingTagIds: tagIds });
    }, [patch]);

    /** Reemplaza los nombres de tag externos (MoreAbout → tienda). */
    const applyTagNames = useCallback((names: string[]) => {
        patch({ tagNameFilter: names.map((name) => name.trim()).filter(Boolean) });
    }, [patch]);

    /** Quita un nombre de tag externo (badge con X). */
    const removeTagName = useCallback((name: string) => {
        const prev = useShopSessionStore.getState().tagNameFilter;
        patch({ tagNameFilter: prev.filter((n) => n !== name) });
    }, [patch]);

    /** Quita un filtro aplicado por su clave (para los badges con X). */
    const removeFilter = useCallback(
        (key: "favorite" | "offer" | "stock" | "rating" | "colorLine" | "priceRange" | "sku") => {
            switch (key) {
                case "favorite":
                    setFavoriteFilter(false);
                    break;
                case "offer":
                    setOfferFilter(false);
                    break;
                case "stock":
                    setStockFilter(false);
                    break;
                case "rating":
                    setRating(undefined);
                    break;
                case "colorLine":
                    setColorLine("");
                    break;
                case "priceRange":
                    clearPriceRange();
                    break;
                case "sku":
                    setSkuFilter(undefined);
                    break;
            }
        },
        [setStockFilter, setRating, setColorLine, setSkuFilter, setFavoriteFilter, setOfferFilter, clearPriceRange]
    );

    /** Limpia solo los filtros (la categoría y la página se conservan). */
    const resetFilters = useCallback(() => {
        patch({
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
        });
    }, [patch]);

    const hasActiveSorts = Object.keys(sorts).length > 0;

    const hasActiveFilters = useMemo(
        () =>
            favoriteCheck ||
            offerCheck ||
            stockCheck ||
            ratingFilter !== undefined ||
            colorLineFilter !== undefined ||
            (skuFilter !== undefined && skuFilter.length > 0) ||
            priceRange !== undefined ||
            hasActiveSorts ||
            pendingTagIds.length > 0 ||
            tagNameFilter.length > 0,
        [favoriteCheck, offerCheck, stockCheck, ratingFilter, colorLineFilter, skuFilter, priceRange, hasActiveSorts, pendingTagIds, tagNameFilter]
    );

    const activeFilterCount = useMemo(
        () =>
            (favoriteCheck ? 1 : 0) +
            (offerCheck ? 1 : 0) +
            (stockCheck ? 1 : 0) +
            (ratingFilter !== undefined ? 1 : 0) +
            (colorLineFilter !== undefined ? 1 : 0) +
            (skuFilter !== undefined && skuFilter.length > 0 ? 1 : 0) +
            (priceRange !== undefined ? 1 : 0) +
            Object.keys(sorts).length +
            pendingTagIds.length +
            tagNameFilter.length,
        [favoriteCheck, offerCheck, stockCheck, ratingFilter, colorLineFilter, skuFilter, priceRange, sorts, pendingTagIds, tagNameFilter]
    );

    return {
        sorts,
        favoriteCheck,
        offerCheck,
        stockCheck,
        ratingFilter,
        colorLineFilter,
        skuFilter,
        localPriceRange,
        priceRange,
        pendingTagIds,
        debouncedTagIds,
        isTagDebouncing,
        tagNameFilter,

        setSortDirection,
        setFavoriteFilter,
        setOfferFilter,
        setStockFilter,
        setRating,
        setColorLine,
        setSkuFilter,
        setLocalPriceRange,
        applyPriceRange,
        clearPriceRange,
        toggleTag,
        clearTags,
        replaceTags,
        applyTagNames,
        removeTagName,
        removeFilter,
        resetFilters,
        hasActiveFilters,
        activeFilterCount,
    };
}
