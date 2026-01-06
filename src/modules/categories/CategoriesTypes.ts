export type CategoryType = {
  uuid: string;
  name: string;
};

export type SubcategoriesType = {
  uuid: string;
  description: string;
  level: number;
  father_uuid: string | null;
  children?: SubcategoriesType[];
};


