import type { SubcategoriesType } from "./CategoriesTypes";

// Build hierarchy tree
export const buildHierarchyTree = (flatData: SubcategoriesType[] | undefined): SubcategoriesType[] => {
  if(!flatData){
    return [];
  };
  
  const attributeMap = new Map<number, SubcategoriesType>();
  const roots: SubcategoriesType[] = [];

  // Crear mapa de nodos por id
  for (const item of flatData) {
    attributeMap.set(item.id, { ...item, children: [] });
  }

  // Construir jerarquía usando father_id
  for (const item of flatData) {
    const node = attributeMap.get(item.id)!;

    if (item.father_id === null) {
      roots.push(node); // Es una raíz
    } else {
      const parent = attributeMap.get(item.father_id);
      if (parent) {
        parent.children!.push(node);
      }
    }
  }

  return roots;
};


export const findAncestors = (
  tree: SubcategoriesType[],
  targetId: number,
  path: number[] = []
): number[] => {
  for (const node of tree) {
    // Add this node to the path
    const newPath = [...path, node.id];

    // if the id is finded, return the path 
    if (node.id === targetId) {
      return newPath;
    }

    // Si tiene hijos, seguimos buscando
    if (node.children?.length) {
      const result = findAncestors(node.children, targetId, newPath);
      if (result.length) {
        return result;
      }
    }
  }
  return [];
};
