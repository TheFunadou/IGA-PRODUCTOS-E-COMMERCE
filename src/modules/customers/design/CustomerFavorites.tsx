import ProductVersionCard from "../../products/components/ProductVersionCard";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { Link, useSearchParams } from "react-router-dom";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { useFetchProductVersionCardsV2 } from "../../products/hooks/useFetchProductVersionCards";

const CustomerFavorites = () => {
    document.title = "Iga Productos | Mis favoritos";

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const orderByParam = searchParams.get("orderBy") as "recent" | "ancient" | null;
    const currentOrderBy = orderByParam || "recent";

    const { data: favorites, isLoading, error } = useFetchProductVersionCardsV2({
        filters: { onlyFavorites: true }
    });

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString(), orderBy: currentOrderBy });
    };

    const handleOrderByChange = (newOrderBy: "recent" | "ancient") => {
        setSearchParams({ page: "1", orderBy: newOrderBy });
    };

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200 animate-fade-in-up">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaHeart className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Mis favoritos
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Productos que has marcado como favoritos
                        </p>
                    </div>
                </div>

                <select
                    className="select select-sm sm:select-md bg-base-100 border-base-300 w-full sm:w-auto"
                    value={currentOrderBy}
                    onChange={(e) => handleOrderByChange(e.target.value as "recent" | "ancient")}
                >
                    <option value="recent">Más recientes</option>
                    <option value="ancient">Más antiguos</option>
                </select>
            </div>

            {/* ── Loading ── */}
            {isLoading && !error && !favorites && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="rounded-2xl bg-base-100 border border-base-300 aspect-[3/4] animate-pulse" />
                    ))}
                </div>
            )}

            {/* ── Error ── */}
            {!isLoading && error && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                            <FaHeart className="text-error text-sm" />
                        </div>
                        <h2 className="font-bold text-base-content text-sm uppercase">
                            Error al cargar favoritos
                        </h2>
                    </div>
                    <div className="p-5">
                        <p className="text-sm text-base-content/70">{getErrorMessage(error)}</p>
                    </div>
                </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && !error && (!favorites || favorites.data.length === 0) && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                            <FaHeart className="text-3xl text-base-content/20" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-base-content">
                                Aún no tienes favoritos
                            </p>
                            <p className="text-sm text-base-content/50 mt-1">
                                Explora la tienda y marca los productos que más te gusten
                            </p>
                        </div>
                        <Link to="/tienda" className="btn btn-primary btn-sm gap-2 mt-1">
                            <FaShoppingBag className="text-base" />
                            Explorar tienda
                        </Link>
                    </div>
                </div>
            )}

            {/* ── Grid de favoritos ── */}
            {!isLoading && !error && favorites && favorites.data.length > 0 && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap gap-4">
                        {favorites.data.map((data, index) => (
                            <ProductVersionCard
                                key={`${index}-${data.sku}`}
                                versionData={data}
                                className="sm:w-56 sm:min-h-80 md:w-64 md:min-h-96 lg:w-72 lg:min-h-[26rem] xl:w-76 xl:min-h-[28rem] 2xl:w-80 2xl:min-h-[30rem]"
                            />
                        ))}
                    </div>

                    {/* Paginación */}
                    {favorites.totalPages > 1 && (
                        <div className="flex flex-col items-center sm:items-start gap-2">
                            <PaginationComponent
                                currentPage={Number(pageParam) || 1}
                                onPageChange={handlePageChange}
                                totalPages={favorites.totalPages}
                            />
                            <p className="text-sm text-base-content/50">
                                Página {Number(pageParam) || 1} de {favorites.totalPages}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerFavorites;