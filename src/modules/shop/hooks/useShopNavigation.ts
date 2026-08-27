import { useCallback, useState } from "react";
import { useFetchMainCategories } from "../../categories/hooks/useFetchCategories";
import type { CategoryType } from "../../categories/CategoriesTypes";

export function useShopNavigation() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const {
        data: categories,
        isLoading: categoriesLoading,
        error: categoriesError,
        refetch: refetchCategories,
    } = useFetchMainCategories();

    const selectCategory = useCallback((category: CategoryType) => {
        setSelectedCategory((prev) => {
            if (prev?.uuid === category.uuid) return prev;
            return { uuid: category.uuid, name: category.name };
        });
        setCurrentPage(1);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedCategory(undefined);
        setCurrentPage(1);
    }, []);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

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
