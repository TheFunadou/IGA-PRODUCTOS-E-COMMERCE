// import { useAuthStore } from "../../auth/states/authStore";
import ProductVersionCardShop from "../../products/components/ProductVersionCardShop";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";
import { useFetchCustomerFavorites } from "../hooks/useCustomer";
import { getErrorMessage } from "../../../global/GlobalUtils";


const CustomerFavorites = () => {
    const { theme } = useThemeStore();
    // const { favorites, isLoading, error } = useAuthStore();
    const { data: favorites, isLoading, error } = useFetchCustomerFavorites();

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
                    {!isLoading && !error && favorites && favorites.length === 0 && "No hay favoritos"}
                    {!isLoading && !error && favorites && favorites.map((data, index) => (
                        <ProductVersionCardShop key={`${index}-${data.product_version.sku}`} versionData={data} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerFavorites;