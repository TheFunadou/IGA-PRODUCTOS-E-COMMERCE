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
 * Converts any string to kebab-case format, handling special characters, accents, and symbols
 * @param input - The input string example: "Safety Helmet (Blue) - 'Premium' 100%"
 * @returns A string in kebab-case format -> "safety-helmet-blue-premium-100"
 * @example
 * makeSlug("Casco de Seguridad (Azul)") => "casco-de-seguridad-azul"
 * makeSlug("Product's Name - 50% Off!") => "products-name-50-off"
 * makeSlug("Café 'Especial' (México)") => "cafe-especial-mexico"
 */
export const makeSlug = (input: string): string => {
    return input
        .toLowerCase()                           // Convert to lowercase
        .normalize("NFD")                        // Normalize Unicode (separate accents)
        .replace(/[\u0300-\u036f]/g, "")        // Remove accent marks
        .replace(/[()[\]{}'"`,;:!?¿¡]/g, "")    // Remove parentheses, brackets, quotes, punctuation
        .replace(/[%&$#@*+=<>|\\\/~^]/g, "")    // Remove special symbols
        .replace(/\s+/g, "-")                    // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, "")             // Remove any remaining non-alphanumeric characters (except hyphens)
        .replace(/-+/g, "-")                     // Replace multiple consecutive hyphens with single hyphen
        .replace(/^-+|-+$/g, "");               // Remove leading/trailing hyphens
};

export const ProductDetailToProductCardFormat = (data: ProductVersionDetailType | undefined, isFavorite: boolean = false): ProductVersionCardType => {
    if (!data) { throw new Error("Hubo un error al procesar los datos del detalle de producto"); }
    return {
        product_name: data.product.product_name ?? "N/A",
        subcategories: data.subcategories ?? [],
        product_version: {
            sku: data.product_version.sku ?? "N/A",
            unit_price: data.product_version.unit_price ?? "0",
            color_line: data.product_version.color_line ?? "N/A",
            color_code: data.product_version.color_code ?? "#FFFFFF",
            color_name: data.product_version.color_name ?? "N/A",
            stock: data.product_version.stock ?? 0,
        },
        product_images: data.product_images ? data.product_images.filter(img => img.main_image === true) : [],
        category: data.category ?? "N/A",
        isOffer: data.isOffer ?? false,
        discount: data.discount ?? 0,
        isFavorite: isFavorite ?? false,
    };
};

export const containsOffensiveLanguage = (text: string): boolean => {
    if (!text || text.trim().length === 0) return false;

    // ================================
    // Configuración
    // ================================

    const highSeverityPatterns = [
        "eres un p***o",
        "m***da",
        "eres un i****a",
        "pinche p***o",
        "pinche i****a",
        "producto de m****a",
        "empresa de m****a",
        "marca de m****a",
        "no sirve p***a",
        "no vale m****a",
        "chafa",
        "puta p***a",
        "puta m****a",
        "s**o a**l",
        "pendejo",
        "eres un pendejo",
        "hijo de p***a",
        "hijos de su p**a madre",
        "estúpidos",
        "imbécil",
        "basura de empresa",
        "son una basura",
        "estafadores",
        "malditos",
        "vayanse a la m****a",
        "porquería de servicio",
        "rateros"
    ];

    const mediumSeverityPatterns = [
        "de la v***a",
        "vale v***a",
        "una v***a",
        "pura m****a",
        "es m****a",
        "culo",
        "que m****a",
        "esta dlv",
        "es dlv",
        "todo dlv",
        "chingadera",
        "esta chingadera",
        "me vale madre",
        "a la chingada",
        "váyanse al carajo",
        "me cago en",
        "qué asco",
        "mugrero",
        "no mamen",
        "pésimo",
        "alv",
        "está de la m****a"
    ];

    const allowedNegativePhrases = [
        "no me gusto",
        "no lo recomiendo",
        "mala calidad",
        "pesima experiencia",
        "no cumplio mis expectativas",
        "no era lo que esperaba",
        "no funciona como esperaba"
    ];

    const productContextWords = [
        "calidad",
        "material",
        "precio",
        "funciona",
        "durabilidad",
        "envio",
        "entrega",
        "talla",
        "uso",
        "servicio"
    ];

    // ================================
    // Normalización
    // ================================
    const normalized = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    // ================================
    // Permitir crítica negativa válida
    // ================================
    if (
        allowedNegativePhrases.some(phrase =>
            normalized.includes(phrase)
        )
    ) {
        return false;
    }

    // ================================
    // Utils internas
    // ================================
    const patternToRegex = (pattern: string) =>
        new RegExp(
            `\\b${pattern.replace(/\*/g, "[a-z0-9]*")}\\b`,
            "i"
        );

    // ================================
    // Scoring de toxicidad
    // ================================
    let score = 0;

    highSeverityPatterns.forEach(p => {
        if (patternToRegex(p).test(normalized)) score += 3;
    });

    mediumSeverityPatterns.forEach(p => {
        if (patternToRegex(p).test(normalized)) score += 1;
    });

    // ================================
    // Contexto del producto
    // ================================
    const hasProductContext = productContextWords.some(word =>
        normalized.includes(word)
    );

    // ================================
    // Regla final
    // ================================
    if (score >= 3) return true;              // ofensivo directo
    if (score >= 1 && !hasProductContext) return true; // grosería sin contexto

    return false;
};
