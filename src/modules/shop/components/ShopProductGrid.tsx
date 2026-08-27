import clsx from "clsx";
import ProductVersionCardV3 from "../../products/components/ProductVersionCardV3";
import ProductVersionCardV3Skeleton from "../../products/components/ProductVersionCardV3Skeleton";
import type { PV3CardData } from "../../products/ProductTypes";

interface ShopProductGridProps {
    products: PV3CardData[];
    isLoading: boolean;
    viewMode: "grid" | "list";
}

const ShopProductGrid = ({ products, isLoading, viewMode }: ShopProductGridProps) => {
    if (isLoading && !products.length) {
        return (
            <div className="w-full">
                <div
                    className={clsx(
                        viewMode === "grid"
                            ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
                            : "flex flex-col gap-4"
                    )}
                >
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductVersionCardV3Skeleton key={i} viewMode={viewMode} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                className={clsx(
                    viewMode === "grid"
                        ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
                        : "flex flex-col gap-4"
                )}
            >
                {products.map((card) => (
                    <ProductVersionCardV3
                        key={`${card.version.sku}-${card.product.id}`}
                        data={card}
                        viewMode={viewMode}
                        imageLoading="lazy"
                    />
                ))}
            </div>
        </div>
    );
};

export default ShopProductGrid;
