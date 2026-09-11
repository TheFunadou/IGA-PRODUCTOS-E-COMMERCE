import { useMemo } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductVersionCardV3 from "../../products/components/ProductVersionCardV3";
import ProductVersionCardV3Skeleton from "../../products/components/ProductVersionCardV3Skeleton";
import { useFetchProductVersionCardsV3 } from "../../products/hooks/useFetchProductVersionCards";
import { useAuthStore } from "../../auth/states/authStore";
import type { PV3CardData } from "../../products/ProductTypes";

const MAX_VISIBLE = 4;

const FavoritesSectionV3 = () => {
    const { isAuth } = useAuthStore();

    const { data, isLoading } = useFetchProductVersionCardsV3(
        {
            pagination: { page: 1, limit: MAX_VISIBLE },
            filters: { onlyFavorites: true },
        },
        { enabled: isAuth }
    );

    const cards = useMemo(() => (data?.data ?? []).slice(0, MAX_VISIBLE), [data]);
    const totalFavorites = data?.totalRecords ?? 0;

    if (!isAuth || (!isLoading && cards.length === 0)) return null;

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <FaHeart className="text-primary text-sm" />
                    <div>
                        <h2 className="text-sm font-bold text-base-content uppercase">Mis favoritos</h2>
                        <p className="text-xs text-base-content/50">Productos que guardaste para después</p>
                    </div>
                </div>
                <Link
                    to="/mis-favoritos"
                    className="text-xs sm:text-sm text-primary underline underline-offset-2 hover:opacity-70 transition-opacity shrink-0"
                >
                    Ver todos ({totalFavorites})
                </Link>
            </div>

            {isLoading ? (
                <div className="w-full flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {[...Array(MAX_VISIBLE)].map((_, i) => (
                        <div key={i} className="w-44 sm:w-48 md:w-56 shrink-0 snap-start">
                            <ProductVersionCardV3Skeleton viewMode="grid" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {cards.map((item: PV3CardData) => (
                        <div
                            key={`${item.version.sku}-${item.product.id}`}
                            className="w-44 sm:w-48 md:w-56 shrink-0 snap-start"
                        >
                            <ProductVersionCardV3
                                data={item}
                                imageLoading="lazy"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesSectionV3;