
export type CategoryType = {
  id: number;
  name: string;
};

export type SubcategoriesType = {
  id: number;
  category_id: number;
  description: string;
  level: number;
  father_id: number | null;
  children?: SubcategoriesType[];
};

export type SelectedCategoryType = {
    category_id:number;
    subcategories_path:number[];
};
