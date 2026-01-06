import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchMainCategories, useFetchSubcategories } from "./useFetchCategories";
import type { CategoryType, SubcategoriesType } from "../CategoriesTypes";
import { buildHierarchyTree, findAncestors } from "../CategoriesUtils";
import useDebounce from "../../../global/hooks/useDebounce";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";

/**
 * Options for configuring the useCategories hook behavior
 */
interface UseCategoriesOptions {
    /** Enable automatic URL navigation with query parameters when categories/subcategories change */
    enableQueryParamsNavigate: boolean;
    /** Initial category name to select on mount */
    initCategory?: string;
    /** Initial subcategory path (array of subcategory IDs) to select on mount */
    initSubcategoryPath?: string[];
}

/**
 * Custom hook for managing category and subcategory state, navigation, and breadcrumb generation
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing category data, state, and handler functions
 */
export function useCategories(options?: UseCategoriesOptions) {
    const navigate = useNavigate();

    // ============================================================================
    // State Management
    // ============================================================================

    /** Hierarchical tree structure of subcategories */
    const [subcategories, setSubcategories] = useState<SubcategoriesType[]>([]);

    /** Array of selected subcategory IDs representing the current path */
    const [subcategoriesPath, setSubcategoriesPath] = useState<string[]>([]);

    /** Human-readable breadcrumb trail of subcategory names */
    const [subcategoriesBreadcrumb, setSubcategoriesBreadcrumb] = useState<string[]>([]);

    /** Currently selected main category */
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>(undefined);

    /** Generated query parameter string for URL navigation */
    const [queryParams, setQueryParams] = useState<string>("");

    /** Debounced version of subcategoriesPath to prevent excessive updates */
    const debouncedSubcategoriesPath = useDebounce<string[]>(subcategoriesPath, 1000);

    // ============================================================================
    // Data Fetching
    // ============================================================================

    /** Fetch main categories from API */
    const {
        data: categories,
        isLoading: categoriesLoading,
        error: categoriesError,
        refetch: refetchCategories
    } = useFetchMainCategories();

    /** Fetch subcategories for the selected category */
    const {
        data: flatSubcategories,
        isLoading: subcategoriesLoading,
        error: subcategoriesError,
        refetch: refetchSubcategories
    } = useFetchSubcategories(selectedCategory?.uuid);

    // ============================================================================
    // Helper Functions
    // ============================================================================

    /**
     * Builds query parameter string from current category and subcategory selections
     * Only used when enableQueryParamsNavigate is disabled
     */
    const buildQueryParams = () => {
        if (selectedCategory && !options?.enableQueryParamsNavigate) {
            const category = `category=${selectedCategory.name.toLocaleLowerCase()}`;
            const subcategories = subcategoriesPath.map((item) => `sub=${item}`).join("&");
            setQueryParams(`?${category}${subcategories.length > 0 ? `&${subcategories}` : ""}`);
        }
    };

    /**
     * Generates breadcrumb trail from subcategory path
     * @param subcategoriesPath - Array of subcategory IDs to generate breadcrumb from
     */
    const handleSetBreadcrumb = (subcategoriesPath: string[]) => {
        if (flatSubcategories && flatSubcategories.length > 0) {
            const breadcrumb: string[] = flatSubcategories
                .filter(item => subcategoriesPath.includes(item.uuid))
                .sort((a, b) => subcategoriesPath.indexOf(a.uuid) - subcategoriesPath.indexOf(b.uuid))
                .map(item => item.description);
            setSubcategoriesBreadcrumb(breadcrumb);
            console.log("init breadcrumb", breadcrumb);
        }
    };

    // ============================================================================
    // Effects
    // ============================================================================

    /**
     * Updates query params when subcategory path or selected category changes
     * Only runs when query param navigation is disabled
     */
    useEffect(() => {
        if (!options?.enableQueryParamsNavigate) buildQueryParams();
    }, [subcategoriesPath, selectedCategory]);

    /**
     * Initializes category and subcategory from options when categories are loaded
     * Only runs when query param navigation is enabled
     */
    useEffect(() => {
        if (options && options.enableQueryParamsNavigate && categories) {
            const category = categories.find(cat => cat.name.toLowerCase() === options.initCategory);
            if (category) setSelectedCategory(category);
            if (options.initSubcategoryPath) {
                setSubcategoriesPath(options.initSubcategoryPath);
            }
        }
    }, [categories]);

    /**
     * Builds hierarchical subcategory tree when flat subcategories are loaded
     * Also initializes breadcrumb if there's an initial subcategory path
     */
    useEffect(() => {
        if (flatSubcategories && flatSubcategories.length > 0) {
            const buildTree: SubcategoriesType[] = buildHierarchyTree(flatSubcategories);
            setSubcategories(buildTree);
            if (options && options?.enableQueryParamsNavigate && options.initSubcategoryPath) {
                handleSetBreadcrumb(options.initSubcategoryPath);
            }
        } else {
            setSubcategories([]);
        }
    }, [flatSubcategories]);

    // ============================================================================
    // Event Handlers
    // ============================================================================

    /**
     * Handles navigation to a specific subcategory
     * Updates path, breadcrumb, and optionally navigates to URL with query params
     * Debounced to prevent excessive updates during rapid clicks
     * 
     * @param subcategory_id - ID of the subcategory to navigate to
     */
    const handleSubcategoryNavigate = useDebounceCallback((subcategoryUUID: string) => {
        if (!flatSubcategories && !subcategories.length) return;
        const path: string[] = findAncestors(subcategories, subcategoryUUID);
        setSubcategoriesPath(path);
        handleSetBreadcrumb(path);
        if (options?.enableQueryParamsNavigate && selectedCategory) {
            const subcategories = path.map((item) => `sub=${item}`).join("&");
            navigate(`/tienda?category=${selectedCategory.name.toLowerCase()}${subcategories.length > 0 ? `&${subcategories}` : ""}`);
        }
    }, 300);

    /**
     * Clears all category and subcategory selections
     * Resets state to initial empty values
     */
    const handleSetClear = () => {
        setSelectedCategory(undefined);
        setSubcategoriesBreadcrumb([]);
        setSubcategoriesPath([]);
        setQueryParams("");
    };

    /**
     * Changes the selected main category
     * Clears subcategory selections and optionally navigates to URL
     * 
     * @param category - The category to select
     */
    const handleChangeCategory = (category: CategoryType) => {
        if (!selectedCategory || selectedCategory.uuid !== category.uuid) {
            setSelectedCategory({ uuid: category.uuid, name: category.name });
            setSubcategoriesPath([]);
            setSubcategoriesBreadcrumb([]);
            if (options?.enableQueryParamsNavigate) {
                navigate(`/tienda?category=${category.name.toLowerCase()}`);
            }
        }
    };

    // ============================================================================
    // Return Value
    // ============================================================================

    return {
        // Category data and state
        categories,
        categoriesLoading,
        categoriesError,
        refetchCategories,

        // Subcategory data and state
        subcategories,
        subcategoriesLoading,
        subcategoriesError,
        refetchSubcategories,

        // Derived state
        debouncedSubcategoriesPath,
        subcategoriesBreadcrumb,
        selectedCategory,
        queryParams,

        // Event handlers
        handleSubcategoryNavigate,
        handleSetClear,
        handleChangeCategory,
    };
}