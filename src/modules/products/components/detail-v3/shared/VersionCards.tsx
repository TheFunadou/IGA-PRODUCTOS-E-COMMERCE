import { Link } from "react-router-dom";
import clsx from "clsx";
import NotFoundSVG from "../../../../../assets/products/NotFound.svg";
import { formatPrice, makeSlug } from "../../../Helpers";
import type { SafeParentDetailedI } from "../../../ProductTypes";

/* Tarjeta atómica de versión (compartida por mobile y desktop):
   se renderiza con scroll horizontal en mobile (w-[104px]) y con
   wrap en desktop (lg:w-[88px]), exactamente como en el diseño original. */
export interface VersionCardsProps {
    sortedParents: SafeParentDetailedI[];
    currentSku?: string;
    categorySlug: string;
    productName: string;
}

const VersionCards = ({ sortedParents, currentSku, categorySlug, productName }: VersionCardsProps) => (
    <>
        {sortedParents.map((version) => {
            const isCurrent = version.sku.toLowerCase() === currentSku?.toLowerCase();
            return (
                <Link
                    key={version.sku}
                    to={`/tienda/${categorySlug}/${makeSlug(productName)}/${version.sku.toLowerCase()}`}
                    title={version.sku}
                    className={clsx(
                        "relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 overflow-hidden shrink-0 w-[104px] lg:w-[88px]",
                        isCurrent
                            ? "border-2 border-primary bg-primary/5 shadow-md ring-2 ring-primary/10 ring-offset-2 scale-105 z-10"
                            : "border border-base-200 bg-base-100 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                    )}
                >
                    {version.offer?.isOffer && (
                        <span className="absolute top-1 right-1 badge badge-xs badge-error font-bold text-[9px] text-white border-0">
                            -{version.offer.discount}%
                        </span>
                    )}
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center">
                        <img
                            className="w-full h-full object-contain p-1"
                            src={version.imageUrl || NotFoundSVG}
                            alt={version.sku}
                            loading="lazy"
                        />
                    </div>
                    <div
                        className="w-3 h-3 rounded-full border border-base-300 shadow-sm"
                        style={{ backgroundColor: version.colorCode }}
                    />
                    <p className={clsx(
                        "font-extrabold text-xs lg:text-[11px]",
                        isCurrent ? "text-primary" : "text-base-content"
                    )}>
                        ${formatPrice(version.finalPrice || version.unitPrice, "es-MX")}
                    </p>
                </Link>
            );
        })}
    </>
);

export default VersionCards;
