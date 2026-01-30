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
        <OverflowXComponent className="gap-10 ">
            {data && data.map((category => (
                <div className="w-100 h-110 flex-shrink-0 p-5 rounded-xl shadow-lg bg-white flex flex-col justify-center">
                    <div className="w-full h-100 grid grid-cols-2 gap-5 items-center justify-center">
                        {category.productVersion.map((pv => (
                            <figure className="w-40 h-40 cursor-pointer" onClick={() => handleRedirectToDetails({ productName: pv.productName, sku: pv.sku, category: category.categoryName })}>
                                <img className="w-full h-full object-cover rounded-xl border border-gray-300 hover:border-primary duration-150" src={pv.imageUrl} alt={`${category.categoryName}-${pv.sku}`} aria-label={`${category.categoryName}-${pv.sku}`} loading="lazy" />
                            </figure>
                        )))}
                    </div>
                    <div className="w-full h-10 flex items-center justify-center">
                        <Link to={`/tienda?category=${category.categoryName.toLowerCase()}&page=1`} className="text-center hover:underline hover:text-primary text-2xl font-bold">{category.categoryName}</Link>
                    </div>
                </div>
            )))}
        </OverflowXComponent>
    );
}

export default CategoriesSummary;