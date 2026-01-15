// import { useAuthStore } from "../../auth/states/authStore";
import ProductVersionCardShop from "../../products/components/ProductVersionCardShop";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";
import { useFetchCustomerFavorites } from "../hooks/useCustomer";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { Link, useSearchParams } from "react-router-dom";
import PaginationComponent from "../../../global/components/PaginationComponent";


const CustomerFavorites = () => {
    const MAX_LIMIT_ROWS = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const { theme } = useThemeStore();
    const { data: favorites, isLoading, error } = useFetchCustomerFavorites({
        pagination: { page: Number(pageParam) || 1, limit: MAX_LIMIT_ROWS }
    });

    const handlePageChange = (page: number) => setSearchParams({ page: page.toString() });

    console.log(JSON.stringify(favorites, null, 2));

    return (
        <div className="animate-fade-in-up">
            <div className={clsx("w-full rounded-xl p-10", theme === "ligth" && "bg-white", theme === "dark" && "bg-slate-900")}>
                <p className="text-3xl font-bold">Mis favoritos</p>
                <select defaultValue={"recent"} className="select mt-2">
                    <option value="recent">Mas recientes</option>
                    <option value="ancient">Mas antiguos</option>
                </select>
                <div className="w-full flex flex-wrap gap-5 mt-5">
                    {!favorites && isLoading && "Cargando..."}
                    {!isLoading && error && <div>{getErrorMessage(error)}</div>}
                    {!isLoading && !error && !favorites && (
                        <div className="bg-gray-100 p-5 rounded-xl">
                            <h2>No tienes productos marcados como favoritos</h2>
                            <h4><Link to="/tienda" className="underline text-primary">Explora la tienda</Link> y marca los productos que más te gusten!! 🔥</h4>
                        </div>
                    )}
                    {!isLoading && !error && favorites && favorites.data.length > 0 && favorites.data.map((data, index) => (
                        <div>
                            <ProductVersionCardShop key={`${index}-${data.product_version.sku}`} versionData={data} />
                            {favorites.totalPages > 1 && (
                                <div className="mt-5"><PaginationComponent currentPage={Number(pageParam) || 1} onPageChange={handlePageChange} totalPages={favorites.totalPages} /></div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerFavorites;