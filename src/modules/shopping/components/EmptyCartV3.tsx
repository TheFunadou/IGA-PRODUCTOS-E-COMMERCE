import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import TrustBadgesV3 from "./TrustBadgesV3";
import SideAdBanner from "./SideAdBanner";
import RecentlyViewed from "./RecentlyViewed";
import FavoritesSectionV3 from "./FavoritesSectionV3";

const EmptyCartV3 = () => {
    return (
        <section className="w-full flex flex-col lg:flex-row gap-5">
            <div className="flex-1 min-w-0 flex flex-col gap-5">
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                            <MdShoppingBag className="text-primary" />
                            Productos (0)
                        </h2>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 px-4 py-12">
                        <div className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center">
                            <MdShoppingBag className="text-3xl text-base-content/30" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-base-content mb-1">Tu carrito está vacío</h3>
                            <p className="text-sm text-base-content/50">Agrega productos desde la tienda para comenzar</p>
                        </div>
                        <Link to="/#tienda" className="btn btn-primary gap-2">
                            <FaShoppingBag className="text-sm" />
                            Ir a la tienda
                        </Link>
                    </div>
                </div>
                <RecentlyViewed />
                <FavoritesSectionV3 />
            </div>
            <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
                <TrustBadgesV3 />
                <SideAdBanner />
            </div>
        </section>
    );
};

export default EmptyCartV3;