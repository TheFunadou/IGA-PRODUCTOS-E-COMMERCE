import { useState, useCallback, useMemo } from "react";
import useDebounce from "../../../global/hooks/useDebounce";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import type { colorLine, PV3Sort, PV3SortField } from "../../products/ProductTypes";

export type SortDirection = "asc" | "desc";

const TAG_DEBOUNCE_MS = 1000;

export function useShopFilters() {
    const [sorts, setSortsState] = useState<PV3Sort>({});
    const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
    const [offerCheck, setOfferCheck] = useState<boolean>(false);
    const [stockCheck, setStockCheck] = useState<boolean>(false);
    const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
    const [colorLineFilter, setColorLineFilter] = useState<colorLine | undefined>(undefined);
    const [skuFilter, setSkuFilterState] = useState<string[] | undefined>(undefined);
    const [localPriceRange, setLocalPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
    const [priceRange, setPriceRange] = useState<{ min: number; max: number } | undefined>(undefined);

    // Tags: selección inmediata en UI (pending) + consulta diferida 1000ms
    const [pendingTagIds, setPendingTagIds] = useState<string[]>([]);
    const debouncedTagIds = useDebounce(pendingTagIds, TAG_DEBOUNCE_MS);
    const isTagDebouncing = JSON.stringify(pendingTagIds) !== JSON.stringify(debouncedTagIds);

    // Nombres de tag aplicados desde fuera de la tienda (MoreAbout): efecto inmediato
    const [tagNameFilter, setTagNameFilter] = useState<string[]>([]);

    const setSortDirection = useCallback((field: PV3SortField, dir?: SortDirection) => {
        setSortsState((prev) => {
            if (!dir) {
                if (!(field in prev)) return prev;
                const next = { ...prev };
                delete next[field];
                return next;
            }
            if (prev[field] === dir) return prev;
            return { ...prev, [field]: dir };
        });
    }, []);

    const setFavoriteFilter = useDebounceCallback((checked: boolean) => {
        setFavoriteCheck(checked);
    }, 250);

    const setOfferFilter = useDebounceCallback((checked: boolean) => {
        setOfferCheck(checked);
    }, 250);

    const setStockFilter = useDebounceCallback((checked: boolean) => {
        setStockCheck(checked);
    }, 250);

    const setRating = useDebounceCallback((rating?: number) => {
        setRatingFilter(rating);
    }, 250);

    const setColorLine = useDebounceCallback((value: string) => {
        const val = value === "" ? undefined : (value as colorLine);
        setColorLineFilter(val);
    }, 250);

    const setSkuFilter = useDebounceCallback((skus?: string[]) => {
        setSkuFilterState(skus && skus.length > 0 ? skus : undefined);
    }, 250);

    const applyPriceRange = useCallback(() => {
        const min = localPriceRange.min ? parseFloat(localPriceRange.min) : undefined;
        const max = localPriceRange.max ? parseFloat(localPriceRange.max) : undefined;
        if (!min && !max) {
            setPriceRange(undefined);
            return;
        }
        if (priceRange && priceRange.min === min && priceRange.max === max) return;
        setPriceRange({ min: min ?? 0, max: max ?? 0 });
    }, [localPriceRange, priceRange]);

    const clearPriceRange = useCallback(() => {
        setLocalPriceRange({ min: "", max: "" });
        setPriceRange(undefined);
    }, []);

    const toggleTag = useCallback((tagId: string) => {
        setPendingTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    }, []);

    const clearTags = useCallback(() => {
        setPendingTagIds([]);
    }, []);

    /** Reemplaza los nombres de tag externos (MoreAbout → tienda). */
    const applyTagNames = useCallback((names: string[]) => {
        setTagNameFilter(names.map((name) => name.trim()).filter(Boolean));
    }, []);

    /** Quita un nombre de tag externo (badge con X). */
    const removeTagName = useCallback((name: string) => {
        setTagNameFilter((prev) => prev.filter((n) => n !== name));
    }, []);

    /** Quita un filtro aplicado por su clave (para los badges con X). */
    const removeFilter = useCallback(
        (key: "favorite" | "offer" | "stock" | "rating" | "colorLine" | "priceRange" | "sku") => {
            switch (key) {
                case "favorite":
                    setFavoriteCheck(false);
                    break;
                case "offer":
                    setOfferCheck(false);
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
        [setStockFilter, setRating, setColorLine, setSkuFilter, clearPriceRange]
    );

    const resetFilters = useCallback(() => {
        setSortsState({});
        setFavoriteCheck(false);
        setOfferCheck(false);
        setStockCheck(false);
        setRatingFilter(undefined);
        setColorLineFilter(undefined);
        setSkuFilterState(undefined);
        setLocalPriceRange({ min: "", max: "" });
        setPriceRange(undefined);
        setPendingTagIds([]);
        setTagNameFilter([]);
    }, []);

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
        applyTagNames,
        removeTagName,
        removeFilter,
        resetFilters,
        hasActiveFilters,
        activeFilterCount,
    };
}
