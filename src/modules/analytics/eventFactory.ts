export const createViewContentEvent = (product: any) => ({
    content_name: product.name || product.title,
    content_category: product.category,
    content_ids: [product.id || product.sku],
    content_type: 'product',
    value: product.price,
    currency: product.currency || 'MXN',
});

export const createAddToCartEvent = (params: {
    productName: string,
    skuList: string[],
    price: number,
    currency: "MXN" | "USD",
    quantity: number
}) => {
    const value = params.price * params.quantity;
    return {
        content_name: params.productName,
        content_ids: params.skuList,
        content_type: "product",
        value,
        currency: params.currency || "MXN",
        num_items: params.quantity
    }
};

export const createInitiateCheckoutEvent = (cartTotal: number, numItems: number) => ({
    value: cartTotal,
    currency: 'MXN',
    num_items: numItems,
});

export const createPurchaseEvent = (order: any) => ({
    content_ids: order.items?.map((item: any) => item.id || item.sku) || [],
    content_type: 'product',
    value: order.total || order.value,
    currency: order.currency || 'MXN',
    num_items: order.items?.length || 1,
});
