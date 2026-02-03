import { Link, useNavigate } from "react-router-dom";
import { useFetchCategoriesSummary } from "../../categories/hooks/useFetchCategories";
import { OverflowXComponent } from "./OverflowXComponent";
import { makeSlug } from "../../products/Helpers";

const CategoriesSummary = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useFetchCategoriesSummary();

    if (isLoading) {
        return (
            <div className="flex gap-10">
                <div className="skeleton w-100 h-100 rounded-xl"></div>
                <div className="skeleton w-100 h-100 rounded-xl"></div>
                <div className="skeleton w-100 h-100 rounded-xl"></div>
                <div className="skeleton w-100 h-100 rounded-xl"></div>
            </div>
        )
    };

    if (error) {
        return <div />
    };

    const handleRedirectToDetails = ({ category, productName, sku }: { productName: string, sku: string, category: string }) => {
        return navigate(`/tienda/${category.toLowerCase()}/${makeSlug(productName.toLocaleLowerCase())}/${sku.toLocaleLowerCase()}`)
    };

    return (
        <OverflowXComponent className="gap-10 mt-2">
            {data && data.map(((category, index) => (
                <div key={`${category.categoryName}-${index}`} className="w-60 md:w-100 h-auto md:h-110 flex-shrink-0 p-2 md:p-5 rounded-xl border border-gray-300 bg-base-100 hover:border-primary duration-150 flex flex-col justify-center">
                    <div className="w-full h-auto md:h-100 grid grid-cols-2 gap-1 md:gap-5 items-center justify-center">
                        {category.productVersion.map(((pv, index) => (
                            <figure key={`${category.categoryName}-${pv.sku}-${index}`} className="w-full aspect-square md:w-40 md:h-40 cursor-pointer" onClick={() => handleRedirectToDetails({ productName: pv.productName, sku: pv.sku, category: category.categoryName })}>
                                <img className="w-full h-full object-cover rounded-lg md:rounded-xl border border-gray-300 hover:border-secondary duration-150" src={pv.imageUrl} alt={`${category.categoryName}-${pv.sku}`} aria-label={`${category.categoryName}-${pv.sku}`} loading="lazy" />
                            </figure>
                        )))}
                    </div>
                    <div className="w-full h-auto md:h-10 flex items-center justify-center mt-1 md:mt-0">
                        <Link to={`/tienda?category=${category.categoryName.toLowerCase()}&page=1`} className="text-center hover:underline hover:text-primary text-sm md:text-2xl font-bold">{category.categoryName}</Link>
                    </div>
                </div>
            )))}
        </OverflowXComponent>
    );
}

export default CategoriesSummary;