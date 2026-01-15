
/**
 * 
 * @param modal -- HTMLDialog element of the modal
 * 
 * --Open a modal 
 */
export const showModal = (modal: HTMLDialogElement | null) => {
  if (modal) { modal.showModal() };
};

export const closeModal = (modal: HTMLDialogElement | null) => {
  if (modal) { modal.close(); }
};

/**
 * Build a consistent query
 * 
 * @param entity - Name of the entity
 * @param params - Optional params
 * 
 * @returns Inmutable query key
 * 
 * @example
 * ```typescript
 * // Without params
 * buildKey("users");
 * // ["users"]
 * 
 * // With params
 * buildKey("users", { id: "123", active: true });
 * // ["users", { id: "123", active: true }]
 * 
 * // With specific ID
 * buildKey("users", "uuid-123");
 * // ["users", "uuid-123"]
 * ```
 */
export const buildKey = <T extends Record<string, any> | string>(
  entity: string,
  params?: T
) => {
  if (params === undefined) {
    return [entity] as const;
  }
  return [entity, params] as const;
};


/**
 * Compara dos objetos de formulario y retorna solo los campos que cambiaron
 * Excluye valores falsy y campos que no han sido modificados
 * 
 * @param original - Objeto original del formulario
 * @param updated - Objeto parcial con los valores actualizados
 * @returns Objeto con solo los campos modificados (excluyendo valores falsy)
 * 
 * @example
 * const original = { nombre: "joel", apellido: "baez", ocupacion: undefined };
 * const updated = { nombre: "joel", apellido: "baez cortez", ocupacion: undefined };
 * const result = getFormChanges(original, updated);
 * // result: { apellido: "baez cortez" }
 * 
 * @example
 * const original = { nombre: "joel", apellido: "baez", ocupacion: undefined };
 * const updated = { nombre: "joel", apellido: "baez", ocupacion: undefined };
 * const result = getFormChanges(original, updated);
 * // result: {}
 */
export function getFormChanges<T extends Record<string, any>>(
  original: T,
  updated: Partial<T>
): Partial<T> {
  const changes: Partial<T> = {};

  // Iterar sobre las claves del objeto actualizado
  for (const key in updated) {
    if (updated.hasOwnProperty(key)) {
      const originalValue = original[key];
      const updatedValue = updated[key];

      // Verificar si el valor es truthy (excluir valores falsy)
      if (updatedValue) {
        // Comparar si los valores son diferentes
        if (originalValue !== updatedValue) {
          changes[key] = updatedValue;
        }
      }
    }
  }

  return changes;
};

export const calcShippingCost = (args: { itemQty: number }): { boxesQty: number, shippingCost: number } => {
  const BOX_COST = 264.00;
  const MAX_ITEMS_PER_BOX = 10;
  const boxesQty = Math.ceil(args.itemQty / MAX_ITEMS_PER_BOX);
  const shippingCost = boxesQty * BOX_COST;
  return { boxesQty, shippingCost };
};

