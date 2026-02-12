
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
    unit_price_with_discount?: string | null;
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

// export type GetSubcategoriesType = {
//     subcategories: Pick<SubcategoriesType, "description">;
// // };

// export type GetSubcategoriesType = Pick<SubcategoriesType, "uuid" | "description">;

export type ParentVersionType = {
    sku: string;
    unit_price: string;
    discount: number;
    product_images: Pick<ProductImagesType, "image_url">[]
};

type ProductImagesSafeType = Omit<ProductImagesType, "product_version_id" | "id">[];

export type ProductVersionDetailType = {
    product: Pick<ProductType, "product_name" | "applications" | "certifications_desc" | "description" | "recommendations" | "specs"> & { uuid: string },
    subcategories: string[];
    product_version: Omit<ProductVersionType, "id" | "product_id" | "created_at" | "updated_at" | "main_version">;
    product_images: ProductImagesSafeType
    parent_versions?: ParentVersionType[];
    category: string;
    isOffer?: boolean;
    discount?: number;
    isFavorite?: boolean;
    isReviewed?: boolean;
};

export type ProductVersionCardType = {
    product_name: string;
    subcategories: string[];
    product_version: Pick<ProductVersionType, "unit_price" | "sku" | "color_line" | "color_name" | "color_code" | "stock" | "unit_price_with_discount">;
    product_images: ProductImagesSafeType
    category: string;
    isOffer?: boolean;
    discount?: number;
    isFavorite?: boolean;
};

export type PVCardsResponseType = {
    data: ProductVersionCardType[];
    totalRecords: number;
    totalPages: number;
};

export type SearchedProductType = {
    sku: string;
    product_name: string;
    category: string;
    color: string;
};

export type ProductVersionCardFilters = {
    page?: number;
    limit: number;
    random?: boolean;
    onlyFavorites?: boolean;
    category?: string;
    subcategoryPath?: string[];
    onlyOffers?: boolean;
    moreExpensive?: boolean;
};


export type ProductVersionRandomOptions = {
    limit: number;
    entity?: string;
};

export type ProductVersionReviews = {
    uuid: string;
    rating: number;
    title: string;
    comment: string;
    created_at: Date;
};

export type ProductVersionReviewsAttributes = Pick<ProductVersionReviews, "rating" | "title" | "comment">;

export type AddPVReviewType = ProductVersionReviewsAttributes & {
    sku: string;
};

export type PVCustomerReview = Omit<ProductVersionReviews, "id" | "product_version_id" | "customer_id"> & {
    customer: string;
};

export type GetProductVersionReviewsType = {
    reviews: PVCustomerReview[];
    totalRecords: number;
    totalPages: number;
};


export type GetPVReviewRatingType = {
    rating: number;
    percentage: number;
};

export type PVReviewResumeType = {
    ratingResume: GetPVReviewRatingType[];
    ratingAverage: number;
    totalReviews: number;
};