// import type { SubcategoriesType } from "./CategoriesTypes";

import type { SubcategoriesType } from "./CategoriesTypes";

// // Build hierarchy tree
// export const buildHierarchyTree = (flatData: SubcategoriesType[] | undefined): SubcategoriesType[] => {
//   if (!flatData) {
//     return [];
//   };

//   const attributeMap = new Map<number, SubcategoriesType>();
//   const roots: SubcategoriesType[] = [];

//   // Crear mapa de nodos por id
//   for (const item of flatData) {
//     attributeMap.set(item.id, { ...item, children: [] });
//   }

//   // Construir jerarquía usando father_id
//   for (const item of flatData) {
//     const node = attributeMap.get(item.id)!;

//     if (item.father_id === null) {
//       roots.push(node); // Es una raíz
//     } else {
//       const parent = attributeMap.get(item.father_id);
//       if (parent) {
//         parent.children!.push(node);
//       }
//     }
//   }

//   return roots;
// };

// // export const buildSubcategoriesTree = (flatTree?: SubcategoriesType[]): SubcategoriesType[] => {
// //   if(!flatTree) return [];
// //   const attributeMap = new Map<string, SubcategoriesType>();
// //   const roots: SubcategoriesType[] = [];
// //   for(const item of flatTree) attributeMap.set(item.uuid, { ...item, children: [] });
// //   for(const item of flatTree){
// //     const node = attributeMap.get(item.uuid)!;
// //     if(item.father_id === null) roots.push(node);
// //     else {
// //       const parent = attributeMap.get(item.father_id);
// //       if(parent) parent.children!.push(node);
// //     }
// //   }
// // }


// export const findAncestors = (
//   tree: SubcategoriesType[],
//   targetId: number,
//   path: number[] = []
// ): number[] => {
//   for (const node of tree) {
//     // Add this node to the path
//     const newPath = [...path, node.id];

//     // if the id is finded, return the path
//     if (node.id === targetId) {
//       return newPath;
//     }

//     // Si tiene hijos, seguimos buscando
//     if (node.children?.length) {
//       const result = findAncestors(node.children, targetId, newPath);
//       if (result.length) {
//         return result;
//       }
//     }
//   }
//   return [];
// };

// // export const findSubcategories = (
// //   tree: SubcategoriesType[],
// //   targetUUID: string,
// //   path: string[] = []
// // ): string[] => {
// //   for (const node of tree) {
// //     const newPath = [...path, node.uuid];
// //     if (node.uuid === targetUUID) return newPath;
// //     if (node.children?.length) {
// //       const result = findSubcategories(node.children, targetUUID, newPath);
// //       if (result.length) return result;
// //     }
// //   }
// //   return [];
// // };


export const buildHierarchyTree = (flatSubcategories: SubcategoriesType[]): SubcategoriesType[] => {
  if (!flatSubcategories) return [];
  const attributeMap = new Map<string, SubcategoriesType>();
  const roots: SubcategoriesType[] = [];
  for (const sub of flatSubcategories) attributeMap.set(sub.uuid, { ...sub, children: [] });
  for (const sub of flatSubcategories) {
    const node = attributeMap.get(sub.uuid)!;
    if (sub.father_uuid === null) {
      roots.push(node);
    } else {
      const parent = attributeMap.get(sub.father_uuid);
      if (parent) parent.children?.push(node);
    };
  };
  return roots;
};

export const findAncestors = (
  tree: SubcategoriesType[],
  targetUUID: string,
  path: string[] = []
): string[] => {
  for (const node of tree) {
    const newPath = [...path, node.uuid];
    if (node.uuid === targetUUID) return newPath;
    if (node.children?.length) {
      const result = findAncestors(node.children, targetUUID, newPath);
      if (result.length) return result;
    };
  };
  return [];
};