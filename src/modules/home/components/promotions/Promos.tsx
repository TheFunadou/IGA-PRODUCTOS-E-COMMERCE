import PromoTrack from "./PromoTrack";
import RecentlyViewedPromo from "./RecentlyViewedPromo";
import FeaturedOffersPromo from "./FeaturedOffersPromo";
import DayOfDeadPromo from "./DayOfDeadPromo";

/**
 * Bloque de promociones del home: pista horizontal de alto fijo que contiene
 * los tiles (vistos recientemente, ofertas destacadas y Día de Muertos).
 * Cada sección se oculta automáticamente si no tiene contenido.
 */
const Promos = () => {
    return (
        <div className="py-2">
            <PromoTrack>
                <RecentlyViewedPromo />
                <FeaturedOffersPromo />
                <DayOfDeadPromo />
            </PromoTrack>
        </div>
    );
};

export default Promos;
