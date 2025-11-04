import type { SubcategoriesType } from "../categories/CategoriesTypes";

export type ProductType = {
    id: number;
    product_name: string;
    category_id: number;
    description: string;
    specs: string;
    recommendations: string;
    applications: string;
    certifications_desc: string;
    created_at: Date;
    updated_at: Date;
};

export type ProductVersionType = {
    id: number;
    product_id: number;
    sku: string;
    code_bar?: string;
    color_line: string;
    color_name: string;
    color_code: string;
    status: string;
    stock: number;
    unit_price: string;
    technical_sheet_url: string;
    created_at: Date;
    updated_at: Date;
    main_version: boolean;
};

export type ProductAttributesType = {
    product_id: number;
    category_attribute_id: number
};

export type ProductSourcesType = {
    id: number;
    product_id: number;
    source_description: string;
    source_url: string;
};

export type ProductImagesType = {
    id: number;
    product_version_id: number;
    image_url: string;
    main_image: boolean;
};

export type GetProductAttributesType = {
    category_attribute: Pick<SubcategoriesType, "id" | "description">;
};

export type ParentVersionType = {
    sku:string;
    unit_price:string;
    discount:number;
    product_images: Pick<ProductImagesType,"image_url">[]
};

type ProductImagesSafeType = Omit<ProductImagesType, "product_version_id" | "id">[];

export type ProductVersionDetailType = {
    product: Pick<ProductType,"product_name" | "applications" | "certifications_desc" | "description" | "recommendations" | "specs">,
    product_attributes: GetProductAttributesType[];
    product_version: Omit<ProductVersionType,"id" | "product_id" | "created_at" | "updated_at" | "main_version">;
    product_images: ProductImagesSafeType
    parent_versions?: ParentVersionType[];
    category:string;
    isOffer?: boolean;
    discount?: number;
    isFavorite?: boolean;
};

export type ProductVersionCardType = {
    product_name: string;
    product_attributes: GetProductAttributesType[];
    product_version: Pick<ProductVersionType,"unit_price" | "sku" | "color_line" | "color_name" | "color_code" | "stock">;
    product_images: ProductImagesSafeType
    category: string;
    isOffer?: boolean;
    discount?: number;
    isFavorite?: boolean;
};

export type PVCardsResponseType = {
    product_version_cards: ProductVersionCardType[];
    total_records: number;
};

export type SearchedProductType = {
    sku:string;
    product_name:string;
    category:string;
    color:string;
};


export type ProductVersionCardFilters = {
    page?: number;
    limit: number;
    random?: boolean; 
    onlyFavorites?: boolean;
    category?: string;
    subcategoryPath?: number[];
    onlyOffers?: boolean;
    moreExpensive?: boolean;
};


export type ProductVersionRandomOptions = {
    limit:number;
    entity?:string;
};