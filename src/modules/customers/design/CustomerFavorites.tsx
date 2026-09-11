import { useMemo } from "react";
import ProductVersionCardV3 from "../../products/components/ProductVersionCardV3";
import ProductVersionCardV3Skeleton from "../../products/components/ProductVersionCardV3Skeleton";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { Link, useSearchParams } from "react-router-dom";
import PaginationComponent from "../../../global/components/PaginationComponent";
import RecentlyViewed from "../../shopping/components/RecentlyViewed";
import { FaHeart, FaLightbulb, FaShoppingBag } from "react-icons/fa";
import { useFetchProductVersionCardsV3 } from "../../products/hooks/useFetchProductVersionCards";
import { useAuthStore } from "../../auth/states/authStore";
import { useRecentlyViewedStore } from "../../../global/states/recentlyViewedStore";
import type { PV3CardData, PV3Sort } from "../../products/ProductTypes";

const LIMIT = 12;
const SUGGESTIONS_LIMIT = 4;
const SUGGESTIONS_TRIGGER = 5;

const CustomerFavorites = () => {
    document.title = "Iga Productos | Mis favoritos";

    const { isAuth } = useAuthStore();
    const recentlyViewedSkus = useRecentlyViewedStore((state) => state.skus);

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = Number(searchParams.get("page")) || 1;
    const orderByParam = searchParams.get("orderBy") as "recent" | "ancient" | null;
    const currentOrderBy = orderByParam || "recent";

    const sort: PV3Sort = currentOrderBy === "recent" ? { created_at: "desc" } : { created_at: "asc" };

    const { data: favorites, isLoading, error } = useFetchProductVersionCardsV3(
        {
            pagination: { page: pageParam, limit: LIMIT },
            filters: { onlyFavorites: true },
            sort,
        },
        { enabled: isAuth }
    );

    const totalFavorites = favorites?.totalRecords ?? 0;
    const favoriteSkus = useMemo(
        () => (favorites?.data ?? []).map((item: PV3CardData) => item.version.sku),
        [favorites?.data]
    );

    /* Categoría del favorito agregado más recientemente (independiente del orden activo) */
    const suggestionCategoryUuid = useMemo(() => {
        if (!favorites?.data || favorites.data.length === 0) return undefined;
        const mostRecent = [...favorites.data].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        return mostRecent?.product?.category?.uuid;
    }, [favorites?.data]);

    const excludeSkus = useMemo(() => {
        const set = new Set<string>();
        for (const sku of [...favoriteSkus, ...recentlyViewedSkus]) set.add(sku.toUpperCase());
        return Array.from(set);
    }, [favoriteSkus, recentlyViewedSkus]);

    const showSuggestions = totalFavorites > 0 && totalFavorites <= SUGGESTIONS_TRIGGER;

    const { data: suggestions, isLoading: suggestionsLoading } = useFetchProductVersionCardsV3(
        {
            pagination: { page: 1, limit: SUGGESTIONS_LIMIT },
            filters: {
                categoryUuid: suggestionCategoryUuid,
                sku: excludeSkus,
            },
        },
        {
            enabled:
                isAuth &&
                showSuggestions &&
                !!suggestionCategoryUuid &&
                excludeSkus.length > 0,
        }
    );

    const suggestionCards = suggestions?.data?.slice(0, SUGGESTIONS_LIMIT) ?? [];

    if (!isAuth) return null;

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString(), orderBy: currentOrderBy });
    };

    const handleOrderByChange = (newOrderBy: "recent" | "ancient") => {
        setSearchParams({ page: "1", orderBy: newOrderBy });
    };

    return (
        <div className="w-full flex justify-center items-center px-2 sm:px-3 md:px-4 py-6 md:py-10">
            <div className="w-full md:w-80/100 flex flex-col gap-5">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm shrink-0">
                            <FaHeart className="text-primary text-lg sm:text-xl" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                                Mis favoritos
                            </h1>
                            <p className="text-sm sm:text-base text-base-content/60 mt-1.5 font-medium">
                                Productos que guardaste para después
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {favorites && !isLoading && (
                            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-base-content/70">
                                <FaHeart className="text-primary text-xs" />
                                {totalFavorites} {totalFavorites === 1 ? "producto guardado" : "productos guardados"}
                            </span>
                        )}
                        <select
                            className="select select-sm sm:select-md bg-base-100 border-base-300 w-full sm:w-auto"
                            value={currentOrderBy}
                            onChange={(e) => handleOrderByChange(e.target.value as "recent" | "ancient")}
                        >
                            <option value="recent">Más recientes</option>
                            <option value="ancient">Más antiguos</option>
                        </select>
                    </div>
                </div>

                {/* ── Loading ── */}
                {isLoading && !error && !favorites && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: LIMIT }).map((_, i) => (
                            <ProductVersionCardV3Skeleton key={i} viewMode="grid" />
                        ))}
                    </div>
                )}

                {/* ── Error ── */}
                {!isLoading && error && (
                    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-error/5 border-b border-error/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                                <FaHeart className="text-error text-lg" />
                            </div>
                            <h2 className="font-bold text-error text-sm uppercase">
                                Error al cargar favoritos
                            </h2>
                        </div>
                        <div className="p-8 flex flex-col items-center gap-4">
                            <p className="text-sm text-base-content/70 max-w-md text-center">{getErrorMessage(error)}</p>
                            <Link to="/#tienda" className="btn btn-primary btn-sm px-6 gap-2 font-bold">
                                <FaShoppingBag className="text-xs" />
                                Ir a la tienda
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!isLoading && !error && (!favorites || favorites.data.length === 0) && (
                    <div className="flex flex-col gap-5 animate-fade-in-up">
                        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
                            <div className="flex flex-col items-center justify-center gap-6 py-14 px-6 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-base-200 flex items-center justify-center border border-base-300/50 shadow-inner">
                                    <FaHeart className="text-4xl text-base-content/20" />
                                </div>
                                <div className="max-w-sm">
                                    <p className="text-xl font-bold text-base-content">
                                        Aún no tienes favoritos
                                    </p>
                                    <p className="text-sm text-base-content/50 mt-2 leading-relaxed">
                                        Guarda los productos que necesitas para tu equipo y encuéntralos aquí cuando quieras.
                                    </p>
                                </div>
                                <ol className="flex flex-col items-start gap-2 mx-auto">
                                    <li className="flex items-center gap-2 text-sm font-medium text-base-content/70">
                                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">1</span>
                                        Explora la tienda
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-medium text-base-content/70">
                                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">2</span>
                                        Toca el corazón <FaHeart className="text-primary text-xs" /> en cualquier producto
                                    </li>
                                </ol>
                                <Link to="/#tienda" className="btn btn-primary btn-md gap-3 font-bold px-8 shadow-md">
                                    <FaShoppingBag className="text-lg" />
                                    Explorar tienda
                                </Link>
                            </div>
                        </div>

                        <RecentlyViewed />
                    </div>
                )}

                {/* ── Grid de favoritos ── */}
                {!isLoading && !error && favorites && favorites.data.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {favorites.data.map((item: PV3CardData) => (
                                <ProductVersionCardV3
                                    key={`${item.version.sku}-${item.product.id}`}
                                    data={item}
                                    imageLoading="lazy"
                                />
                            ))}
                        </div>

                        {/* Paginación */}
                        {favorites.totalPages > 1 && (
                            <div className="flex flex-col items-center sm:items-start gap-2">
                                <PaginationComponent
                                    currentPage={pageParam}
                                    onPageChange={handlePageChange}
                                    totalPages={favorites.totalPages}
                                />
                                <p className="text-sm text-base-content/50">
                                    Página {pageParam} de {favorites.totalPages}
                                </p>
                            </div>
                        )}

                        {/* Sugerencias cuando hay pocos favoritos */}
                        {showSuggestions && !suggestionsLoading && suggestionCards.length > 0 && (
                            <div className="w-full flex flex-col gap-3 border-t border-base-300/70 pt-6 mt-2">
                                <div className="flex items-center gap-2">
                                    <FaLightbulb className="text-warning text-sm" />
                                    <div>
                                        <h2 className="text-sm font-bold text-base-content uppercase">Sugerencias para ti</h2>
                                        <p className="text-xs text-base-content/50">
                                            Productos de la misma categoría que tus favoritos
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {suggestionCards.map((item: PV3CardData) => (
                                        <ProductVersionCardV3
                                            key={`${item.version.sku}-${item.product.id}`}
                                            data={item}
                                            imageLoading="lazy"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skeletons de sugerencias */}
                        {showSuggestions && suggestionsLoading && (
                            <div className="w-full flex flex-col gap-3 border-t border-base-300/70 pt-6 mt-2">
                                <div className="flex items-center gap-2">
                                    <FaLightbulb className="text-warning text-sm" />
                                    <div>
                                        <h2 className="text-sm font-bold text-base-content uppercase">Sugerencias para ti</h2>
                                        <p className="text-xs text-base-content/50">
                                            Productos de la misma categoría que tus favoritos
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Array.from({ length: SUGGESTIONS_LIMIT }).map((_, i) => (
                                        <ProductVersionCardV3Skeleton key={i} viewMode="grid" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerFavorites;