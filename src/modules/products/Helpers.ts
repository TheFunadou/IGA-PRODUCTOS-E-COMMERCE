import type { ProductVersionCardType, ProductVersionDetailType } from "./ProductTypes";

export const extractLinkID = (link: string): string | null => {
    const match = link.match(/\/file\/d\/([^/]+)\//);
    return match ? match[1] : null;
};


/**
 * 
 * @param inputDate "2025-09-09 16:21:12.724" 
 * @param zone Local zone to format es-MX(DD-MM-AAAA)
 * @returns formatDate ("2025-09-09 16:21:12.724","es-MX") => 09-09-2025
 */
export const formatDate = (inputDate: Date, zone: "es-MX" | "es-ES"): string => {
    const date: Date = new Date(inputDate);
    return new Intl.DateTimeFormat(zone).format(date);
};

/**
 * Format a string or decimal number to LocalString
 * @param price number or decimal value example: 220.04 , 193.1
 * @param zone Local zone to format the number es-MX -> (10000 -> 10,000), en-US (10000 -> 10.000)
 * @returns formated number string example formatPrice(10000,"es-MX") => 10,0000
 */
export const formatPrice = (price: string, zone: "es-MX" | "en-US"): string => {
    return parseFloat(price).toLocaleString(zone, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


/**
 * Return the changes in the form when is different at the defaultValues
 * Example : defaultValues["a","b","c"], data["a","x","c"] -> result["x"]
 * @param data inputObjectData
 * @param defaults defaultValues for the object
 * @returns data with only changes in the data example: getFormChanges({name:"Juan",last_name:"Gonzalez"},{name:"Juan",last_name:"Doe"}) => {last_name: "Gonzalez"}
 */
export function getFormChanges<T extends Record<string, any>>(data: T, defaults: T): Partial<T> {
    return Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== defaults[key as keyof T]) {
            acc[key as keyof T] = value;
        }
        return acc;
    }, {} as Partial<T>);
};


/**
 * 
 * @param input --The input string example -- Safety Helmet
 * @returns -- A string in lowerCase formated  -> safety-helmet
 */
export const makeSlug = (input: string): string => {
    const slug: string = input.toLowerCase().replace(/\s/g, "-");
    return slug;
};



export const ProductDetailToProductCardFormat = (data: ProductVersionDetailType | undefined, isFavorite: boolean = false): ProductVersionCardType => {
    if (!data) { throw new Error("Hubo un error al procesar los datos del detalle de producto"); }
    return {
        product_name: data.product.product_name ?? "N/A",
        product_attributes: data.product_attributes ?? [],
        product_version: {
            sku: data.product_version.sku ?? "N/A",
            unit_price: data.product_version.unit_price ?? "0",
            color_line: data.product_version.color_line ?? "N/A",
            color_code: data.product_version.color_code ?? "#FFFFFF",
            color_name: data.product_version.color_name ?? "N/A",
            stock: data.product_version.stock ?? 0,
        },
        product_images: data.product_images.filter(img => img.main_image === true) ?? [],
        category: data.category ?? "N/A",
        isOffer: data.isOffer ?? false,
        discount: data.discount ?? 0,
        isFavorite: isFavorite ?? false,
    };
};