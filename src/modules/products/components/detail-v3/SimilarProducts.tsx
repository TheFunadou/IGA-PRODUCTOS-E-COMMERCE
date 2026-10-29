import ProductVersionCardV3 from "../ProductVersionCardV3";
import ProductVersionCardV5 from "../ProductVersionCardV5";
import ProductVersionCardSkeleton from "../ProductVersionCardSkeleton";
import ProductVersionCardV3Skeleton from "../ProductVersionCardV3Skeleton";
import type { PV3Response } from "../../ProductTypes";

/* Productos similares: en mobile (<sm) se presentan en versión de lista
   (la misma que usa la tienda en HomeV2 → ShopV3 → ShopProductGrid),
   y desde sm se mantienen en grid exactamente como antes. Es un doble
   render con clases de Tailwind (sin flash ni JS): la rama oculta no
   carga imágenes lazy. */
interface SimilarProductsProps {
    similarProducts: {
        data?: PV3Response;
        isLoading: boolean;
    };
    currentSku?: string;
}

const SimilarProducts = ({ similarProducts, currentSku }: SimilarProductsProps) => (
    <div className="w-full py-10 bg-base-200/30 border-t border-base-200">
        <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-base-content">Productos similares</h2>
                <p className="text-sm font-medium text-base-content/50 mt-0.5">Descubre más opciones con las mismas características</p>
            </div>

            {similarProducts.isLoading && !similarProducts.data && (
                <>
                    {/* Skeleton mobile: lista */}
                    <div className="sm:hidden flex flex-col gap-4 mt-4">
                        {[...Array(4)].map((_, i) => <ProductVersionCardV3Skeleton key={i} viewMode="list" />)}
                    </div>
                    {/* Skeleton desktop: grid */}
                    <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 mt-4">
                        {[...Array(4)].map((_, i) => <ProductVersionCardSkeleton key={i} />)}
                    </div>
                </>
            )}

            {!similarProducts.isLoading && similarProducts.data && (() => {
                const filtered = similarProducts.data.data?.filter(
                    item => item.version.sku.toLowerCase() !== currentSku?.toLowerCase()
                ) ?? [];
                if (filtered.length === 0) return null;
                return (
                    <>
                        {/* Mobile (<sm): lista (mismo estilo que la tienda) */}
                        <div className="sm:hidden flex flex-col gap-4">
                            {filtered.map(item => (
                                <ProductVersionCardV5
                                    key={`${item.version.sku}-${item.product.id}`}
                                    data={item}
                                    viewMode="list"
                                    imageLoading="lazy"
                                />
                            ))}
                        </div>
                        {/* Desktop (≥sm): grid idéntico al original */}
                        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                            {filtered.map(item => (
                                <ProductVersionCardV3
                                    key={`${item.version.sku}-${item.product.id}`}
                                    data={item}
                                    imageLoading="lazy"
                                />
                            ))}
                        </div>
                    </>
                );
            })()}
        </div>
    </div>
);

export default SimilarProducts;
