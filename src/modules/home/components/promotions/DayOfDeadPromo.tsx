import { useMemo } from "react";
import PromoCarousel from "./PromoCarousel";
import { mapPV3CardsToPromoItems } from "./promotionsMappers";
import { useFetchDayOfDeadHelmets } from "../../../products/hooks/useFetchProductVersionCards";

/**
 * Sección temática "Día de Muertos" (tile ancho 16:9 con imagen de fondo 16:9,
 * el marco decorativo se muestra íntegro). SKUs fijos de catálogo.
 */
const DayOfDeadPromo = () => {
    const { data, isLoading } = useFetchDayOfDeadHelmets();

    const items = useMemo(
        () => (data?.data ? mapPV3CardsToPromoItems(data.data).slice(0, 4) : []),
        [data]
    );

    if (isLoading || items.length === 0) return null;

    return (
        <PromoCarousel
            titulo="Día de Muertos"
            subtitulo="Edición especial: cascos con alma propia"
            content={items}
            itemAspectRatio="9/16"
            backgroundColor="bg-purple-950"

        />
    );
};

export default DayOfDeadPromo;
