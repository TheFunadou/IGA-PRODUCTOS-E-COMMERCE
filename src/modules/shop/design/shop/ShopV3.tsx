import { useEffect, useMemo, useRef, useState } from "react";
import { FaShop } from "react-icons/fa6";
import { useShopNavigation } from "../../hooks/useShopNavigation";
import { useShopFilters } from "../../hooks/useShopFilters";
import { useShopProducts } from "../../hooks/useShopProducts";
import { useFetchPublicCategoryTags } from "../../../products/hooks/useFetchProductVersionCards";
import type { PublicCategoryTagItem, PV3SortField } from "../../../products/ProductTypes";
import ShopSidebar from "../../components/ShopSidebar";
import ShopMobileFilters from "../../components/ShopMobileFilters";
import ShopAppliedFilters, { type AppliedFilterKey } from "../../components/ShopAppliedFilters";
import ShopToolbar, { SHOP_SORT_FIELDS } from "../../components/ShopToolbar";
import ShopProductGrid from "../../components/ShopProductGrid";
import ShopEmptyState from "../../components/ShopEmptyState";
import ShopBackToTop from "../../components/ShopBackToTop";
import { scrollToTienda } from "../../utils/scrollToTienda";
import { useShopExternalTagsStore } from "../../states/shopExternalTagsStore";
import { useCartTagStore } from "../../../shopping/stores/cartTagStore";
import PaginationComponent from "../../../../global/components/PaginationComponent";
import { useAuthStore } from "../../../auth/states/authStore";

const VIEW_MODE_KEY = "shop:viewMode:v1";
type ViewMode = "grid" | "list";

function loadViewMode(): ViewMode {
    try {
        const stored = localStorage.getItem(VIEW_MODE_KEY);
        if (stored === "grid" || stored === "list") return stored;
    } catch {
        // localStorage no disponible (modo privado): se usa el valor por defecto
    }
    return "grid";
}

function saveViewMode(mode: ViewMode) {
    try {
        localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch {
        // localStorage no disponible: la preferencia no se persiste
    }
}

export const ShopV3 = () => {
    const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const backToTopSentinelRef = useRef<HTMLDivElement | null>(null);

    const { isAuth } = useAuthStore();

    const navigation = useShopNavigation();
    const filters = useShopFilters();

    /* ── Etiquetas de la categoría seleccionada ── */
    const { data: publicTags, isLoading: tagsLoading } = useFetchPublicCategoryTags(
        navigation.selectedCategory?.uuid
    );

    const categoryTags = useMemo<PublicCategoryTagItem[]>(() => {
        if (!publicTags?.data || !navigation.selectedCategory) return [];
        // La consulta ya filtra por categoría: viene un único grupo.
        return publicTags.data[0]?.tags ?? [];
    }, [publicTags, navigation.selectedCategory]);

    const tagsByTier = useMemo<[number, PublicCategoryTagItem[]][]>(() => {
        const tiers = new Map<number, PublicCategoryTagItem[]>();
        for (const tag of categoryTags) {
            const existing = tiers.get(tag.tier);
            if (existing) existing.push(tag);
            else tiers.set(tag.tier, [tag]);
        }
        return Array.from(tiers.entries()).sort((a, b) => a[0] - b[0]);
    }, [categoryTags]);

    const pendingTagNames = useMemo(() => {
        const map = new Map(categoryTags.map((t) => [t.id, t.name]));
        return filters.pendingTagIds.map((id) => ({ id, name: map.get(id) ?? id }));
    }, [filters.pendingTagIds, categoryTags]);

    /* ── Órdenes activos (para badges) ── */
    const activeSorts = useMemo(
        () =>
            SHOP_SORT_FIELDS.filter((f) => filters.sorts[f.field]).map((f) => ({
                field: f.field,
                dir: filters.sorts[f.field]!,
                label: `${f.label}: ${filters.sorts[f.field] === "asc" ? f.ascLabel : f.descLabel}`,
            })),
        [filters.sorts]
    );

    /* AND entre tiers, OR dentro del mismo tier */
    const tagGroups = useMemo(() => {
        if (filters.debouncedTagIds.length === 0) return [];
        return tagsByTier
            .filter(([, tags]) => tags.some((t) => filters.debouncedTagIds.includes(t.id)))
            .map(([tier, tags]) => ({
                tier,
                tagIds: tags.filter((t) => filters.debouncedTagIds.includes(t.id)).map((t) => t.id),
            }));
    }, [filters.debouncedTagIds, tagsByTier]);

    /* ── Productos ── */
    const products = useShopProducts({
        currentPage: navigation.currentPage,
        sort: filters.sorts,
        favoriteCheck: filters.favoriteCheck,
        offerCheck: filters.offerCheck,
        stockCheck: filters.stockCheck,
        ratingFilter: filters.ratingFilter,
        colorLineFilter: filters.colorLineFilter,
        skuFilter: filters.skuFilter,
        priceRange: filters.priceRange,
        selectedCategory: navigation.selectedCategory,
        tagGroups,
        tagNameFilter: filters.tagNameFilter,
    });

    /* ── Handlers ── */
    const handlePageChange = (page: number) => {
        navigation.setPage(page);
    };

    const handleSelectCategory = (category: { uuid: string; name: string }) => {
        navigation.selectCategory(category);
        filters.clearTags();
        scrollToTienda();
    };

    const handleClearSelection = () => {
        navigation.clearSelection();
        filters.clearTags();
    };

    const handleRemoveFilter = (key: AppliedFilterKey) => {
        filters.removeFilter(key);
        if (navigation.currentPage !== 1) navigation.setPage(1);
    };

    const handleRemoveSort = (field: PV3SortField) => {
        filters.setSortDirection(field, undefined);
    };

    const handleRemoveTag = (tagId: string) => {
        filters.toggleTag(tagId);
    };

    const handleClearAll = () => {
        filters.resetFilters();
        if (navigation.currentPage !== 1) navigation.setPage(1);
    };

    const handleToggleView = (mode: ViewMode) => {
        setViewMode(mode);
        saveViewMode(mode);
    };

    /* Reset página al cambiar cualquier filtro o al terminar el debounce de tags */
    useEffect(() => {
        if (navigation.currentPage !== 1) {
            navigation.setPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filters.sorts,
        filters.favoriteCheck,
        filters.offerCheck,
        filters.stockCheck,
        filters.ratingFilter,
        filters.colorLineFilter,
        filters.skuFilter,
        filters.priceRange,
        filters.debouncedTagIds,
        filters.tagNameFilter,
    ]);

    /* ── Filtro por nombres de tag solicitado desde fuera (MoreAbout) ──
       Reset total (filtros + categoría), aplica los nombres y hace scroll a la tienda */
    const pendingExternalTags = useShopExternalTagsStore((s) => s.pendingTagNames);
    const consumeTagRequest = useShopExternalTagsStore((s) => s.consumeTagRequest);

    useEffect(() => {
        if (!pendingExternalTags || pendingExternalTags.length === 0) return;
        navigation.clearSelection();
        filters.resetFilters();
        filters.applyTagNames(pendingExternalTags);
        consumeTagRequest();
        scrollToTienda();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingExternalTags]);

    /* Consumir tag pendiente al desmontar para evitar scroll inesperado en el siguiente montaje */
    useEffect(() => {
        return () => { consumeTagRequest(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Scroll a #tienda cuando termina el debounce de etiquetas (salta el montaje inicial) */
    useEffect(() => {
        if (filters.debouncedTagIds.length === 0) return;
        scrollToTienda();
    }, [filters.debouncedTagIds]);

    /* ── Track tag names for cart recommendations ── */
    const addCartTags = useCartTagStore((s) => s.addTags);

    useEffect(() => {
        if (filters.debouncedTagIds.length === 0 || categoryTags.length === 0) return;
        const tagNameMap = new Map(categoryTags.map((t) => [t.id, t.name]));
        const names = filters.debouncedTagIds
            .map((id) => tagNameMap.get(id))
            .filter((n): n is string => !!n);
        if (names.length > 0) addCartTags(names);
    }, [filters.debouncedTagIds, categoryTags, addCartTags]);

    const sidebarCommonProps = {
        categories: navigation.categories,
        categoriesLoading: navigation.categoriesLoading,
        categoriesError: navigation.categoriesError,
        refetchCategories: navigation.refetchCategories,
        selectedCategory: navigation.selectedCategory,
        onSelectCategory: handleSelectCategory,
        onClearSelection: handleClearSelection,

        tagsByTier,
        tagsLoading,
        pendingTagIds: filters.pendingTagIds,
        onToggleTag: filters.toggleTag,

        isAuth,
        favoriteCheck: filters.favoriteCheck,
        onSetFavoriteCheck: filters.setFavoriteFilter,
        offerCheck: filters.offerCheck,
        onSetOfferCheck: filters.setOfferFilter,
        stockCheck: filters.stockCheck,
        onSetStockCheck: filters.setStockFilter,
        ratingFilter: filters.ratingFilter,
        onSetRatingFilter: filters.setRating,
        colorLineFilter: filters.colorLineFilter,
        onSetColorLine: filters.setColorLine,
        skuFilter: filters.skuFilter,
        onSetSkuFilter: filters.setSkuFilter,
        localPriceRange: filters.localPriceRange,
        setLocalPriceRange: filters.setLocalPriceRange,
        onApplyPriceRange: filters.applyPriceRange,
        priceRange: filters.priceRange,
        onClearPriceRange: filters.clearPriceRange,

        activeFilterCount: filters.activeFilterCount,
    };

    return (
        <div id="tienda" className="px-4 py-8 sm:px-8 lg:px-20 lg:py-14 scroll-mt-24">
            <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-black text-blue-950 mb-8">
                Tienda de Productos
            </h1>

            <div className="w-full min-h-screen rounded-3xl">
                <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
                    {/* ── SIDEBAR (desktop) ── */}
                    <ShopSidebar {...sidebarCommonProps} />

                    {/* ── MAIN CONTENT ── */}
                    <div className="flex-1 min-w-0 flex flex-col gap-5">
                        {/* Header */}
                        <div>
                            <p className="text-xs text-base-content/40 uppercase tracking-widest mb-1">
                                Tienda{navigation.selectedCategory ? ` / ${navigation.selectedCategory.name}` : ""}
                            </p>
                            <div className="flex items-center gap-3">
                                {!navigation.selectedCategory && (
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-950/10 flex items-center justify-center shrink-0">
                                        <FaShop className="text-blue-950 text-lg sm:text-xl" />
                                    </div>
                                )}
                                <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-base-content">
                                    {navigation.selectedCategory?.name ?? "Ver todos los productos"}
                                </h2>
                            </div>

                            {/* Badges de filtros y etiquetas aplicadas */}
                            <div className="mt-3">
                                <ShopAppliedFilters
                                    favoriteCheck={filters.favoriteCheck}
                                    offerCheck={filters.offerCheck}
                                    stockCheck={filters.stockCheck}
                                    ratingFilter={filters.ratingFilter}
                                    colorLineFilter={filters.colorLineFilter}
                                    priceRange={filters.priceRange}
                                    skuFilter={filters.skuFilter}
                                    activeSorts={activeSorts}
                                    pendingTagNames={pendingTagNames}
                                    tagNameFilter={filters.tagNameFilter}
                                    onRemoveFilter={handleRemoveFilter}
                                    onRemoveSort={handleRemoveSort}
                                    onRemoveTag={handleRemoveTag}
                                    onRemoveTagName={filters.removeTagName}
                                    onClearAll={handleClearAll}
                                />
                            </div>
                        </div>

                        {/* Toolbar */}
                        <ShopToolbar
                            totalRecords={products.totalRecords}
                            sorts={filters.sorts}
                            onSortChange={filters.setSortDirection}
                            viewMode={viewMode}
                            onViewModeChange={handleToggleView}
                            onOpenMobileFilters={() => setShowMobileFilters(true)}
                        />

                        {/* Resultados */}
                        <section className="relative flex flex-col items-center gap-4">
                            {/* Overlay de carga durante el debounce de etiquetas (1000ms) */}
                            {filters.isTagDebouncing && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100/70 backdrop-blur-[1px] rounded-xl">
                                    <span className="flex items-center gap-2 text-sm font-semibold text-base-content/60 bg-base-100 border border-base-300 shadow-sm px-4 py-2 rounded-full">
                                        <span className="loading loading-spinner loading-sm text-primary" />
                                        Aplicando etiquetas...
                                    </span>
                                </div>
                            )}

                            {/* Loading */}
                            {products.isLoading && !products.error && !products.data && (
                                <ShopProductGrid
                                    products={[]}
                                    isLoading={true}
                                    viewMode={viewMode}
                                />
                            )}

                            {/* Error */}
                            {products.error && !products.data && !products.isLoading && (
                                <ShopEmptyState
                                    type="error"
                                    message="No se pudieron cargar los productos"
                                    onRetry={products.refetch}
                                />
                            )}

                            {/* Productos */}
                            {!products.isLoading && !products.error && products.data && (
                                <>
                                    {products.data.data && products.data.data.length > 0 ? (
                                        <>
                                            <div className="w-full">
                                                <ShopProductGrid
                                                    products={products.data.data}
                                                    isLoading={false}
                                                    viewMode={viewMode}
                                                />
                                            </div>
                                            <div className="mt-8 mb-4">
                                                <PaginationComponent
                                                    currentPage={navigation.currentPage}
                                                    onPageChange={handlePageChange}
                                                    totalPages={products.totalPages}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <ShopEmptyState type="empty" />
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                </div>

                {/* Drawer de filtros (mobile/tablet) */}
                <ShopMobileFilters
                    isOpen={showMobileFilters}
                    onClose={() => setShowMobileFilters(false)}
                    {...sidebarCommonProps}
                />

                {/* Sentinel para el botón "volver arriba": visible al llegar al final de la sección tienda */}
                <div ref={backToTopSentinelRef} aria-hidden="true" className="h-px w-full" />
            </div>

            <ShopBackToTop sentinelRef={backToTopSentinelRef} />
        </div>
    );
};

export default ShopV3;
