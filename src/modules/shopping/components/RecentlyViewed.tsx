import { useMemo } from "react";
import { FaHistory } from "react-icons/fa";
import ProductVersionCardV3 from "../../products/components/ProductVersionCardV3";
import ProductVersionCardV3Skeleton from "../../products/components/ProductVersionCardV3Skeleton";
import { useFetchProductVersionCardsV3 } from "../../products/hooks/useFetchProductVersionCards";
import type { PV3CardData } from "../../products/ProductTypes";
import { useRecentlyViewedStore } from "../../../global/states/recentlyViewedStore";

interface RecentlyViewedProps {
    excludeSkus?: string[];
}

const MAX_VISIBLE = 4;

const RecentlyViewed = ({ excludeSkus = [] }: RecentlyViewedProps) => {
    const skus = useRecentlyViewedStore((state) => state.skus);

    const normalizedNegative = useMemo(
        () => new Set(excludeSkus.map((sku) => sku.toUpperCase())),
        [excludeSkus]
    );

    const { data, isLoading } = useFetchProductVersionCardsV3(
        {
            pagination: { page: 1, limit: MAX_VISIBLE },
            filters: { sku: skus },
        },
        { enabled: skus.length > 0 }
    );

    const cards = useMemo(() => {
        if (!data?.data) return [];
        return data.data
            .filter((item) => !normalizedNegative.has(item.version.sku.toUpperCase()))
            .slice(0, MAX_VISIBLE);
    }, [data, normalizedNegative]);

    if (skus.length === 0 || (!isLoading && cards.length === 0)) return null;

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <FaHistory className="text-primary text-sm" />
                <div>
                    <h2 className="text-sm font-bold text-base-content uppercase">Vistos recientemente</h2>
                    <p className="text-xs text-base-content/50">Productos que exploraste antes de llegar aquí</p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {[...Array(4)].map((_, i) => <ProductVersionCardV3Skeleton key={i} viewMode="grid" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {cards.map((item: PV3CardData) => (
                        <ProductVersionCardV3
                            key={`${item.version.sku}-${item.product.id}`}
                            data={item}
                            imageLoading="lazy"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentlyViewed;