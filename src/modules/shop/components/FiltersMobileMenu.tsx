import { FaX } from "react-icons/fa6";
import type { CategoryType, SubcategoriesType } from "../../categories/CategoriesTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";
import clsx from "clsx";
import { IoIosArrowDown } from "react-icons/io";
import SubcategoryMenu from "../../categories/components/SubcategoryMenu";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    categories?: CategoryType[];
    categoriesLoading: boolean;
    categoriesError: Error | null;
    refetchCategories: () => void;
    selectedCategory?: CategoryType | null;
    handleChangeCategory: (category: CategoryType) => void;
    handleSetClear: () => void;
    subcategories: SubcategoriesType[];
    subcategoriesLoading: boolean;
    subcategoriesError: Error | null;
    refetchSubcategories: () => void;
    handleSubcategoryNavigate: (subcategoryUUID: string) => void;
    onSetFavoriteCheck: (checked: boolean) => void;
    favoriteCheck: boolean;
    isAuth: boolean;
    theme: "ligth" | "dark";
}

const FiltersMobileMenu = ({
    isOpen,
    onClose,
    categories,
    categoriesLoading,
    categoriesError,
    refetchCategories,
    selectedCategory,
    handleChangeCategory,
    handleSetClear,
    subcategories,
    subcategoriesLoading,
    subcategoriesError,
    refetchSubcategories,
    handleSubcategoryNavigate,
    onSetFavoriteCheck,
    favoriteCheck,
    isAuth,
    theme }: Props) => {
    return (
        <div className="drawer">
            {/* Control del checkbox con React */}
            <input
                id="my-drawer-1"
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                onChange={onClose} // permite cerrarlo si se hace clic fuera
            />

            <div className="h-full drawer-side">
                <label
                    htmlFor="my-drawer-1"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                    onClick={onClose}
                ></label>
                <div className="menu bg-blue-950 min-h-full w-80 p-4">
                    <div className="flex justify-between">
                        <p className="text-xl text-white font-medium">Filtros</p>
                        <button type="button" onClick={onClose}><FaX className="text-white border rounded-xl text-xl" /></button>
                    </div>
                    <div className="mt-5">
                        {categoriesLoading && !categoriesError && (!categories || categories.length === 0) && (
                            <div className="w-full flex flex-col gap-5">
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                            </div>
                        )}
                        {!categoriesLoading && (!categories || categories.length === 0) && categoriesError && (
                            <div>
                                <p className="text-error mt-2 text-lg font-normal">{getErrorMessage(categoriesError)}</p>
                                <button type="button" className="btn btn-primary mt-2" onClick={() => refetchCategories()}>Reintentar</button>
                            </div>
                        )}
                        {!categoriesLoading && !categoriesError && categories && categories.length > 0 && (
                            <div className="w-full flex flex-col gap-5">
                                <button className={clsx(
                                    "w-fit rounded-xl px-2 py-1 text-xl text-white",
                                    !selectedCategory && theme === "ligth" ? "bg-blue-900" : "",
                                    !selectedCategory && theme === "dark" ? "border" : "",

                                )} onClick={handleSetClear}>Ir a la Tienda</button>
                                {categories && categories.length > 0 && categories.map((category, index) => (
                                    <div key={index} className="w-full">
                                        <button
                                            className={clsx(
                                                "w-60/100 px-2 py-1 text-left flex items-center justify-between font-normal text-lg text-white",
                                                selectedCategory && category.uuid === selectedCategory.uuid && theme === "ligth" ? "bg-blue-900 rounded-xl" : "",
                                                selectedCategory && category.uuid === selectedCategory.uuid && theme === "dark" ? "border  rounded-xl" : ""

                                            )}
                                            type="button"
                                            onClick={() => handleChangeCategory(category)}
                                        >
                                            {category.name}
                                            <IoIosArrowDown className={clsx(theme === "ligth" ? "text-blue-950" : "text-white")} />
                                        </button>
                                        <div className={clsx(
                                            "w-full",
                                            subcategories.length > 0 && selectedCategory && category.uuid === selectedCategory.uuid ? "block" : "hidden"
                                        )}>
                                            {subcategoriesLoading ? (
                                                "Cargando subcategorias..."
                                            ) : (
                                                <div className="w-full text-white">
                                                    {subcategoriesError ? (
                                                        <div>
                                                            <p className="text-error mt-2 text-lg font-normal">{getErrorMessage(subcategoriesError)}</p>
                                                            <button className="mt-2 btn btn-primary" onClick={() => refetchSubcategories()}>Reintentar</button>
                                                        </div>
                                                    ) : (
                                                        <SubcategoryMenu data={subcategories} onFindAncestors={handleSubcategoryNavigate} />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="w-full border-t border-white mt-5 py-5 flex flex-col gap-4 text-lg [&_button]:text-start font-normal">
                            {isAuth &&
                                <div className="flex items-center gap-3 text-white">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-neutral"
                                        checked={favoriteCheck}
                                        onChange={(e) => onSetFavoriteCheck(e.target.checked)}
                                    />
                                    <span>Mostrar solo favoritos</span>
                                </div>
                            }
                            <div className="flex items-center gap-3 text-white">
                                <input type="checkbox" className="checkbox" />
                                <span>Mostrar solo ofertas</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FiltersMobileMenu;
