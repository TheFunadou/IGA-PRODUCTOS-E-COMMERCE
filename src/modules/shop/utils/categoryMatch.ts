import type { CategoryType } from "../../categories/CategoriesTypes";
import { makeSlug } from "../../products/Helpers";

/**
 * Busca una categoría a partir de un parámetro de URL.
 *
 * Los enlaces existentes usan indistintamente uuid, nombre en minúsculas o
 * slug ("cascos", "Cascos", "línea-especial"...). Antes solo se comparaba
 * uuid/nombre, por lo que los enlaces con slug no seleccionaban la categoría.
 */
export function findCategoryByParam(
    param: string,
    categories: CategoryType[]
): CategoryType | undefined {
    if (!param) return undefined;

    let decoded = param;
    try {
        decoded = decodeURIComponent(param);
    } catch {
        // El parámetro no venía codificado: se usa tal cual.
    }

    const normalized = decoded.trim().toLocaleLowerCase("es-MX");
    const slug = makeSlug(decoded);

    return categories.find((category) => {
        const name = category.name.trim().toLocaleLowerCase("es-MX");
        return (
            category.uuid === decoded ||
            name === normalized ||
            makeSlug(category.name) === slug
        );
    });
}
