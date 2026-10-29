import VersionCards from "../shared/VersionCards";
import type { SafeParentDetailedI } from "../../../ProductTypes";

/* Presentaciones disponibles (solo desktop; en mobile van bajo la galería) */
interface DesktopVersionsProps {
    sortedParents: SafeParentDetailedI[];
    currentSku?: string;
    categorySlug: string;
    productName: string;
}

const DesktopVersions = ({ sortedParents, currentSku, categorySlug, productName }: DesktopVersionsProps) => (
    <>
        {sortedParents.length > 0 && (
            <div className="hidden lg:flex lg:flex-col gap-2.5">
                <p className="text-[11px] font-bold text-base-content/55 uppercase tracking-widest text-center md:text-start">Presentaciones disponibles</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <VersionCards
                        sortedParents={sortedParents}
                        currentSku={currentSku}
                        categorySlug={categorySlug}
                        productName={productName}
                    />
                </div>
            </div>
        )}
    </>
);

export default DesktopVersions;
