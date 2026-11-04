import { useCallback } from "react";
import { useFetchMainCategories } from "../../categories/hooks/useFetchCategories";
import type { CategoryType } from "../../categories/CategoriesTypes";
import { useShopSessionStore } from "../states/shopSessionStore";

export function useShopNavigation() {
    const selectedCategory = useShopSessionStore((s) => s.selectedCategory);
    const currentPage = useShopSessionStore((s) => s.currentPage);
    const patch = useShopSessionStore((s) => s.patch);

    const {
        data: categories,
        isLoading: categoriesLoading,
        error: categoriesError,
        refetch: refetchCategories,
    } = useFetchMainCategories();

    const selectCategory = useCallback((category: CategoryType) => {
        const prev = useShopSessionStore.getState().selectedCategory;
        patch({
            selectedCategory:
                prev?.uuid === category.uuid
                    ? prev
                    : { uuid: category.uuid, name: category.name },
            currentPage: 1,
        });
    }, [patch]);

    const clearSelection = useCallback(() => {
        patch({ selectedCategory: undefined, currentPage: 1 });
    }, [patch]);

    const setPage = useCallback((page: number) => {
        patch({ currentPage: page });
    }, [patch]);

    return {
        categories,
        categoriesLoading,
        categoriesError,
        refetchCategories,

        selectedCategory,
        currentPage,

        selectCategory,
        clearSelection,
        setPage,
    };
}
