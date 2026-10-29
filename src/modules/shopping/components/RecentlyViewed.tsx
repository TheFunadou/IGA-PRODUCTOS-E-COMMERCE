import { useMemo } from "react";
import { FaHistory } from "react-icons/fa";
import ProductVersionCardV3 from "../../products/components/ProductVersionCardV3";
import ProductVersionCardV5 from "../../products/components/ProductVersionCardV5";
import ProductVersionCardV3Skeleton from "../../products/components/ProductVersionCardV3Skeleton";
import { useFetchProductVersionCardsV3 } from "../../products/hooks/useFetchProductVersionCards";
import type { PV3CardData } from "../../products/ProductTypes";
import { useRecentlyViewedStore } from "../../../global/states/recentlyViewedStore";

interface RecentlyViewedProps {
    excludeSkus?: string[];
    /**
     * true → en mobile (<sm) renderiza las tarjetas en versión lista (la misma
     * ProductVersionCardV5 de la tienda y "Productos similares"); ≥sm conserva
     * el grid original. Doble render con clases de Tailwind (patrón de
     * SimilarProducts: sin flash ni JS). Solo lo pasa el carrito; el resto de
     * páginas que consumen este componente mantienen el grid en todos los anchos.
     */
    mobileList?: boolean;
}

const MAX_VISIBLE = 4;

const RecentlyViewed = ({ excludeSkus = [], mobileList = false }: RecentlyViewedProps) => {
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

            {/* Mobile (<sm): tarjetas en versión lista (solo si mobileList).
                El doble render es el patrón de SimilarProducts: sin flash ni JS,
                y la rama oculta no carga imágenes lazy. */}
            {mobileList && (
                <div className="sm:hidden flex flex-col gap-4">
                    {isLoading ? (
                        [...Array(MAX_VISIBLE)].map((_, i) => (
                            <ProductVersionCardV3Skeleton key={i} viewMode="list" />
                        ))
                    ) : (
                        cards.map((item: PV3CardData) => (
                            <ProductVersionCardV5
                                key={`${item.version.sku}-${item.product.id}`}
                                data={item}
                                viewMode="list"
                                imageLoading="lazy"
                            />
                        ))
                    )}
                </div>
            )}

            {/* Grid original: único cuando no hay variante mobile; con variante,
                oculto por debajo de sm (sm:grid gana sobre hidden por venir
                después en el CSS emitido). */}
            <div
                className={
                    mobileList
                        ? "hidden sm:grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
                        : "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
                }
            >
                {isLoading ? (
                    [...Array(MAX_VISIBLE)].map((_, i) => <ProductVersionCardV3Skeleton key={i} viewMode="grid" />)
                ) : (
                    cards.map((item: PV3CardData) => (
                        <ProductVersionCardV3
                            key={`${item.version.sku}-${item.product.id}`}
                            data={item}
                            imageLoading="lazy"
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentlyViewed;