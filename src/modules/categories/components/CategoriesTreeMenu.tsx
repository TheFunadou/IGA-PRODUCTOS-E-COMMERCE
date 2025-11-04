import { useEffect, useState } from "react";
import { getMainCategoriesService } from "../services/CategoriesServices";
import SubcategoryMenu from "./SubcategoryMenu";
import clsx from "clsx";
import type { CategoryType, SelectedCategoryType, SubcategoriesType } from "../CategoriesTypes";
import { getCategoryDescendantsService } from "../services/SubcategoriesServices";
import { buildHierarchyTree, findAncestors } from "../CategoriesUtils";
import { getErrorMessage } from "../../../global/GlobalUtils";


type Props = {
    onPathStateChange: (newValue: SelectedCategoryType) => void;
    onDisabled?: boolean;
    onSetBreadcrumb?: string[];
    onSetCategory?: string;
}

const CategoriesTreeMenu = ({ onPathStateChange, onDisabled, onSetBreadcrumb, onSetCategory }: Props) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<string>("");
    const [currentCategory, setCurrentCategory] = useState<CategoryType | undefined>(undefined);
    const [subcategoriesLoading, setSubcategoriesLoading] = useState<boolean>(false);
    const [flatSubcategories, setFlatSubcategories] = useState<SubcategoriesType[]>([]);
    const [subcategories, setSubcategories] = useState<SubcategoriesType[]>([]);
    const [breadcrumb, setBreadcrumb] = useState<string[] | undefined>(onSetBreadcrumb);

    // Load Main Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);

                const data: CategoryType[] = await getMainCategoriesService();
                setCategories(data);

                if (onSetCategory) {
                    const currentCategory: CategoryType | undefined = data.find(category => category.name === onSetCategory);
                    setCurrentCategory(currentCategory);
                }

            } catch (error) {
                setError(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    // Load subcategories
    useEffect(() => {
        if (currentCategory && currentCategory !== undefined) {

            const fetchSubcategories = async (): Promise<void> => {
                try {
                    setSubcategoriesLoading(true);
                    const data: SubcategoriesType[] = await getCategoryDescendantsService(currentCategory.id);
                    setFlatSubcategories(data);
                    const buildTree: SubcategoriesType[] = await buildHierarchyTree(data);
                    setSubcategories(buildTree);
                } catch (error) {
                    setError(getErrorMessage(error))

                } finally {
                    setSubcategoriesLoading(false);
                }
            }

            fetchSubcategories();
        }
    }, [currentCategory]);

    const handleBreadcrumb = (subcategory_id: number) => {
        if (!flatSubcategories.length && !subcategories.length) {
            return [];
        }
        const path: number[] = findAncestors(subcategories, subcategory_id);

        if (currentCategory) {
            onPathStateChange({ category_id: currentCategory.id, subcategories_path: path });
        }

        const breadcrumb: string[] = flatSubcategories
            .filter(item => path.includes(item.id))
            .sort((a, b) => path.indexOf(a.id) - path.indexOf(b.id))
            .map(item => item.description);
        setBreadcrumb(breadcrumb);
    }

    const handleCurrentCategory = (category: CategoryType) => {
        setBreadcrumb([]);
        setCurrentCategory(category);
    }

    if (Error) {
        return (
            <div>Error al cargar el panel de categorias...</div>
        );
    }


    return (
        <div className="w-full">
            <div className={clsx(
                "breadcrumbs",
                breadcrumb && breadcrumb.length > 0 ? "block" : "hidden"
            )}>
                <ul>
                    <li>{currentCategory?.name}</li>
                    {breadcrumb && breadcrumb.map((data, index) => (
                        <li key={index}>{data}</li>
                    ))}
                </ul>
            </div>
            <p className="text-lg mt-4">Seleccionar categoria padre:</p>
            {loading ? (
                <span className="loading loading-spinner loading-xl"></span>
            ) : (
                <select defaultValue={onSetCategory} className="select" onChange={(e) => handleCurrentCategory(JSON.parse(e.target.value))} disabled={onDisabled} >
                    <option value={undefined} disabled={true}>Seleccionar...</option>
                    {categories.map(data => (
                        <option key={data.id} value={JSON.stringify({ id: data.id, name: data.name })}>{data.name}</option>
                    ))}
                </select>
            )}

            {subcategoriesLoading ? (
                <span className="loading loading-spinner loading-xl"></span>
            ) : (
                <div className="w-full">
                    {subcategories.length ? (
                        <div className="w-full mt-5">
                            <p>Selecciona la ruta de subcategorias que deseas asignar:</p>
                            <div className="w-2/3 bg-base-200 px-5 mt-2 shadow-lg">
                                <SubcategoryMenu onDisabled={onDisabled} data={subcategories} onFindAncestors={handleBreadcrumb} />
                            </div>
                        </div>
                    ) : (null)}
                </div>
            )}
        </div>
    );
}

export default CategoriesTreeMenu;