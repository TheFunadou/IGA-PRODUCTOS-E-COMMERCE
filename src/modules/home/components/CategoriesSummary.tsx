import { Link, useNavigate } from "react-router-dom";
import { useFetchCategoriesSummary } from "../../categories/hooks/useFetchCategories";
import { OverflowXComponent } from "./OverflowXComponent";
import { makeSlug } from "../../products/Helpers";

const CategoriesSummary = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useFetchCategoriesSummary();

    const handleRedirectToDetails = ({
        category,
        productName,
        sku,
    }: {
        productName: string;
        sku: string;
        category: string;
    }) => {
        return navigate(
            `/tienda/${category.toLowerCase()}/${makeSlug(productName.toLocaleLowerCase())}/${sku.toLocaleLowerCase()}`
        );
    };

    /* ── Skeleton ── */
    if (isLoading) {
        return (
            <div className="flex gap-4 md:gap-6 mt-2 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-56 md:w-80 rounded-xl overflow-hidden border border-base-200 bg-base-100"
                        style={{ animationDelay: `${i * 120}ms` }}
                    >
                        <div className="skeleton h-48 md:h-60 rounded-none" />
                        <div className="grid grid-cols-3 gap-1 p-2">
                            <div className="skeleton rounded-lg aspect-square" />
                            <div className="skeleton rounded-lg aspect-square" />
                            <div className="skeleton rounded-lg aspect-square" />
                        </div>
                        <div className="flex items-center justify-between gap-2 p-3">
                            <div className="skeleton h-5 w-24 rounded-md" />
                            <div className="skeleton h-6 w-16 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error || !data) return <div />;

    return (
        <OverflowXComponent className="flex gap-4 md:gap-6 mt-2 pb-2">
            {data.map((category, index) => {
                /* Primera imagen como hero, el resto como grid secundario */
                const [hero, ...rest] = category.productVersion;

                return (
                    <article
                        key={`${category.categoryName}-${index}`}
                        className="
                            group relative flex-shrink-0
                            w-56 md:w-80
                            rounded-xl overflow-hidden
                            border border-base-200
                            bg-base-100
                            shadow-sm
                            hover:shadow-md hover:border-primary/40
                            hover:-translate-y-1
                            transition-all duration-300 ease-out
                            flex flex-col
                        "
                    >
                        {/* ── Hero image ── */}
                        {hero && (
                            <figure
                                className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer flex-shrink-0"
                                onClick={() =>
                                    handleRedirectToDetails({
                                        productName: hero.productName,
                                        sku: hero.sku,
                                        category: category.categoryName,
                                    })
                                }
                            >
                                <img
                                    src={hero.imageUrl}
                                    alt={hero.productName}
                                    loading="lazy"
                                    className="
                                        w-full h-full object-contain
                                        transition-transform duration-500 ease-out
                                        group-hover:scale-105
                                    "
                                />
                            </figure>
                        )}

                        {/* ── Secondary grid ── */}
                        {rest.length > 0 && (
                            <div className="grid grid-cols-3 gap-1.5 p-2">
                                {rest.slice(0, 3).map((pv, i) => (
                                    <figure
                                        key={`${pv.sku}-${i}`}
                                        className="aspect-square overflow-hidden rounded-lg cursor-pointer"
                                        onClick={() =>
                                            handleRedirectToDetails({
                                                productName: pv.productName,
                                                sku: pv.sku,
                                                category: category.categoryName,
                                            })
                                        }
                                    >
                                        <img
                                            src={pv.imageUrl}
                                            alt={pv.productName}
                                            loading="lazy"
                                            className="
                                                w-full h-full object-contain
                                                opacity-70 hover:opacity-100
                                                scale-100 hover:scale-110
                                                transition-all duration-300
                                                rounded-lg border border-base-200 hover:border-primary/50
                                            "
                                        />
                                    </figure>
                                ))}
                            </div>
                        )}

                        {/* ── Category name + CTA ── */}
                        <div className="flex items-center justify-between gap-2 px-3 py-3 mt-auto">
                            <Link
                                to={`/tienda?category=${category.categoryName.toLowerCase()}&page=1`}
                                className="
                                    font-bold text-sm md:text-base leading-tight
                                    text-base-content
                                    hover:text-primary
                                    transition-colors duration-200
                                    line-clamp-1
                                "
                            >
                                {category.categoryName}
                            </Link>
                            <Link
                                to={`/tienda?category=${category.categoryName.toLowerCase()}&page=1`}
                                className="
                                    flex-shrink-0
                                    text-xs font-semibold
                                    text-base-content/60 border border-base-200
                                    px-3 py-1 rounded-lg
                                    hover:bg-primary hover:text-white hover:border-primary
                                    transition-all duration-200
                                    whitespace-nowrap
                                "
                            >
                                Ver todo
                            </Link>
                        </div>

                        {/* Accent line on hover */}
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                    </article>
                );
            })}
        </OverflowXComponent>
    );
};

export default CategoriesSummary;