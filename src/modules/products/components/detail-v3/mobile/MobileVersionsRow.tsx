import VersionCards from "../shared/VersionCards";
import type { SafeParentDetailedI } from "../../../ProductTypes";

/* Versiones (mobile): debajo de la sección de imágenes, inline con scroll
   horizontal y tarjetas un poco más grandes. El pl-1 vive en el wrapper
   interno w-max para no romper el overflow-x */
interface MobileVersionsRowProps {
    sortedParents: SafeParentDetailedI[];
    currentSku?: string;
    categorySlug: string;
    productName: string;
}

const MobileVersionsRow = ({ sortedParents, currentSku, categorySlug, productName }: MobileVersionsRowProps) => (
    <>
        {sortedParents.length > 0 && (
            <div className="lg:hidden flex flex-col gap-2.5 mt-2">
                <p className="text-[11px] font-bold text-base-content/55 uppercase tracking-widest text-center">Presentaciones disponibles</p>
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
                    <div className="flex gap-2.5 w-max pl-1">
                        <VersionCards
                            sortedParents={sortedParents}
                            currentSku={currentSku}
                            categorySlug={categorySlug}
                            productName={productName}
                        />
                    </div>
                </div>
            </div>
        )}
    </>
);

export default MobileVersionsRow;
