import { useMemo } from "react";
import PromoCarousel from "./PromoCarousel";
import { mapPV3CardsToPromoItems } from "./promotionsMappers";
import { useFetchFeaturedOffers } from "../../../products/hooks/useFetchProductVersionCards";

/**
 * Sección "Ofertas destacadas" (tile verde). No renderiza si no hay
 * ofertas vigentes en catálogo (el backend resuelve status + fechas + usos).
 */
const FeaturedOffersPromo = () => {
    const { data, isLoading } = useFetchFeaturedOffers();

    const items = useMemo(
        () => (data?.data ? mapPV3CardsToPromoItems(data.data).slice(0, 4) : []),
        [data]
    );

    if (isLoading || items.length === 0) return null;

    return (
        <PromoCarousel
            titulo="Ofertas destacadas"
            subtitulo="Los mejores descuentos del catálogo, por tiempo limitado"
            content={items}
            backgroundColor="bg-success"
        />
    );
};

export default FeaturedOffersPromo;
