import clsx from "clsx";
import { useCategories } from "../../modules/categories/hooks/useCategories";
import { MdKeyboardArrowRight } from "react-icons/md";
import SubcategoryMenuV2 from "../../modules/categories/components/SubcategoryMenuV2";
import { useThemeStore } from "../states/themeStore";

type Props = {
    // onShow: (value: boolean) => void
    onScheduleHide: () => void;
};

const ShopMenuPreview = ({ onScheduleHide }: Props) => {
    const { theme } = useThemeStore();

    const {
        categories,
        categoriesLoading,
        categoriesError,
        selectedCategory,
        refetchCategories,
        handleChangeCategory,
        subcategories,
        subcategoriesLoading,
        subcategoriesError,
        refetchSubcategories,
        handleSubcategoryNavigate,
        queryParams
    } = useCategories();

    return (
        <div
            onMouseLeave={onScheduleHide}
            className={clsx("w-40/100 p-5 absolute top-8 rounded-xl z-1 text-black shadow-lg", theme === "ligth" ? "bg-white" : "bg-slate-950")}>
            <p className={clsx("text-lg font-medium", theme === "ligth" ? "text-blue-950" : "text-white")}>Categorias de productos</p>
            <div className="w-full flex mt-2">
                <div className="w-23/100 flex flex-col gap-5 items-start justify-start">
                    {categoriesLoading && !categoriesError && !categories && "Cargando categorias..."}
                    {!categoriesLoading && !categoriesError && !categories && "No hay categorias"}
                    {!categoriesLoading && !categories && categoriesError &&
                        <div>
                            <p className="text-lg">Ocurrio un error inesperado al cargar las categorias principales</p>
                            <button className="btn btn-primary text-lg" onClick={() => refetchCategories()}>Intentar de nuevo</button>
                        </div>
                    }
                    {!categoriesLoading && !categoriesError && categories && categories.length > 0 &&
                        categories.map((data, index) => (
                            <button
                                key={index}
                                type="button"
                                onMouseEnter={() => handleChangeCategory(data)}
                                className={clsx(
                                    "px-2 py-1 rounded-xl w-full flex items-center justify-between gap-2 font-normal bg-transp",
                                    theme === "ligth" && data.uuid === selectedCategory?.uuid && "bg-gray-200",
                                    theme === "dark" && data.uuid === selectedCategory?.uuid && "bg-slate-700"
                                )
                                }>
                                <span className={clsx(theme === "ligth" ? "text-blue-950" : "text-white")}>{data.name}</span><MdKeyboardArrowRight />
                            </button>
                        ))
                    }
                </div>
                {subcategoriesLoading && !subcategoriesError && !subcategories && "Cargando subcategorias..."}
                {!subcategoriesLoading && !subcategoriesError && !subcategories && "No hay subcategorias"}
                {!subcategoriesLoading && (subcategories.length < 0 || !subcategories) && subcategoriesError &&
                    <div>
                        <p className="text-lg">Ocurrio un error inesperado al cargar las subcategorias</p>
                        <button className="btn btn-primary text-lg" onClick={() => refetchSubcategories()}>Intentar de nuevo</button>
                    </div>
                }
                {!subcategoriesLoading && !subcategoriesError && subcategories && subcategories.length > 0 &&
                    <div className="w-77/100 ml-5">
                        <p className={clsx(theme === "ligth" ? "text-blue-950" : "text-white")}>{selectedCategory?.name}</p>
                        <SubcategoryMenuV2 data={subcategories} onFindAncestors={handleSubcategoryNavigate} queryParams={queryParams} />
                    </div>
                }
            </div>
        </div>
    );
};

export default ShopMenuPreview;
