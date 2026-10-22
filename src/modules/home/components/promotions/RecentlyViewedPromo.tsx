import { useMemo } from "react";
import PromoCarousel from "./PromoCarousel";
import { mapPV3CardsToPromoItems } from "./promotionsMappers";
import { useFetchProductVersionCardsV3 } from "../../../products/hooks/useFetchProductVersionCards";
import { useRecentlyViewedStore } from "../../../../global/states/recentlyViewedStore";

/**
 * Sección "Vistos recientemente" (tile rojo).
 * Solo se renderiza cuando hay exactamente 4 productos vistos completos,
 * para conservar la cuadrícula 2×2 llena. Usa el mismo store que ShoppingCartV3.
 */
const RecentlyViewedPromo = () => {
    const skus = useRecentlyViewedStore((state) => state.skus);
    const isComplete = skus.length === 4;

    const { data } = useFetchProductVersionCardsV3(
        { pagination: { page: 1, limit: 4 }, filters: { sku: skus } },
        { enabled: isComplete }
    );

    const items = useMemo(
        () => (data?.data ? mapPV3CardsToPromoItems(data.data).slice(0, 4) : []),
        [data]
    );

    if (!isComplete || items.length !== 4) return null;

    return (
        <PromoCarousel
            titulo="Vistos recientemente"
            subtitulo="Explóralos de nuevo antes de que se te olviden"
            content={items}
            backgroundColor="bg-red-800"
        />
    );
};

export default RecentlyViewedPromo;
