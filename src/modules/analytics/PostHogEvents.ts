import posthog from "posthog-js";
import { useCookieStore } from "../auth/states/cookieStore";

/**
 * Eventos de negocio para PostHog.
 *
 * Nombres de evento alineados con la especificación oficial de e-commerce de
 * PostHog (https://posthog.com/docs/data/event-spec/ecommerce-events) para que
 * los insights, funnels y plantillas funcionen sin taxonomía a medida.
 *
 * Todos los eventos están gateados por el MISMO consentimiento que usa Meta
 * Pixel (`iga-cookie-consent`), así que un usuario que no aceptó el banner
 * jamás genera ninguno de estos eventos. El SDK además hace no-op por su cuenta
 * si no se hizo opt-in, pero aquí lo filtramos explícitamente por claridad.
 */

type ProductLike = {
    id?: string | number;
    sku?: string;
    name?: string;
    title?: string;
    category?: string;
    price?: number;
    finalPrice?: string | number;
    currency?: string;
};

const capture = (event: string, properties?: Record<string, unknown>) => {
    const { consentStatus } = useCookieStore.getState();
    if (consentStatus !== "accepted") return;
    posthog.capture(event, properties);
};

const toPrice = (value: number | string | undefined): number | undefined => {
    if (value === undefined || value === null) return undefined;
    const parsed = typeof value === "number" ? value : parseFloat(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};

/** Propiedades comunes para eventos de producto. */
const productProperties = (product: ProductLike) => ({
    product_id: product.id ?? product.sku,
    sku: product.sku,
    name: product.name ?? product.title,
    category: product.category,
    price: toPrice(product.finalPrice ?? product.price),
    currency: product.currency ?? "MXN",
});

export const phProductViewed = (product: ProductLike) =>
    capture("Product Viewed", productProperties(product));

export const phProductAddedToCart = (
    product: ProductLike,
    quantity: number = 1
) =>
    capture("Product Added To Cart", {
        ...productProperties(product),
        quantity,
        value: (toPrice(product.finalPrice ?? product.price) ?? 0) * quantity,
    });

export const phProductAddedToWishlist = (product: ProductLike) =>
    capture("Product Added to Wishlist", productProperties(product));

export const phCheckoutStarted = (cartTotal: number, numItems: number) =>
    capture("Checkout Started", {
        value: cartTotal,
        currency: "MXN",
        num_items: numItems,
    });

export const phOrderCompleted = (order: {
    total?: number | string;
    value?: number | string;
    currency?: string;
    items?: Array<{ id?: string; sku?: string }>;
}) =>
    capture("Order Completed", {
        value: toPrice(order.total ?? order.value),
        currency: order.currency ?? "MXN",
        num_items: order.items?.length ?? 1,
        product_ids: order.items?.map((item) => item.id ?? item.sku) ?? [],
    });

export const phProductSearched = (query: string, resultsCount: number = 0) =>
    capture("Product Searched", {
        query,
        results_count: resultsCount,
    });

export const phSignedUp = (method: "email" | "google" = "email") =>
    capture("Signed Up", { signup_method: method });

/* ════════════════════════════════════════════════════════════════════════
 * Diagnóstico de abandono de compra (capa 2).
 * Mismo gating de consentimiento que los eventos base.
 * ════════════════════════════════════════════════════════════════════════ */

/** El widget de pago (Wallet MercadoPago) quedó listo/visible para el usuario. */
export const phPaymentInitiated = (provider: string = "mercado_pago") =>
    capture("Payment Initiated", { provider });

/** El pago fue rechazado (página pago-fallido, status REJECTED). */
export const phPaymentFailed = (status: string, orderUUID?: string | null) =>
    capture("Payment Failed", { status, order_uuid: orderUUID ?? undefined });

/** El pago quedó pendiente/in process (página pago-pendiente). */
export const phPaymentPending = (status: string, orderUUID?: string | null) =>
    capture("Payment Pending", { status, order_uuid: orderUUID ?? undefined });

/** Orden cancelada/expire como ABANDONED (registrado o invitado). */
export const phOrderAbandoned = (
    type: "CANCELLED" | "ABANDONED",
    orderUUID?: string | null
) => capture("Order Abandoned", { type, order_uuid: orderUUID ?? undefined });

/** Se quitó un producto del carrito (señal fuerte de duda/abandono). */
export const phCartItemRemoved = (sku: string) =>
    capture("Cart Item Removed", { sku });

/** Se redujo la cantidad de un producto en el carrito (el total asustó). */
export const phCartQuantityDecreased = (
    sku: string,
    quantity: number,
    previousQuantity: number
) =>
    capture("Cart Quantity Decreased", {
        sku,
        quantity,
        previous_quantity: previousQuantity,
    });

/** Error de validación del formulario de invitado (solo nombre de campo y tipo). */
export const phCheckoutFormError = (
    fields: Array<{ field: string; error_type: string }>
) => capture("Checkout Form Error", { fields });

/** Falló la consulta del código postal a Sepomex (usuario bloqueado). */
export const phZipCodeLookupFailed = (zipCode: string) =>
    capture("Zip Code Lookup Failed", { zip_code: zipCode });

/** El usuario vio el costo de envío (causa #1 de abandono en MX). */
export const phShippingCostRevealed = (
    shippingCost: number,
    boxesCount: number
) => capture("Shipping Cost Revealed", { shipping_cost: shippingCost, boxes: boxesCount });

/** Intención de compra frustrada: sin stock o producto pausado. */
export const phAddToCartBlocked = (
    sku: string,
    reason: "out_of_stock" | "paused"
) => capture("Add To Cart Blocked", { sku, reason });

/** El usuario escribió un código de cupón y salió del campo. */
export const phCouponSubmitted = (code: string) =>
    capture("Coupon Submitted", { code });

/** El cupón surtió efecto en la orden (visible en CheckoutV3). */
export const phCouponApplied = (code: string, discount: number) =>
    capture("Coupon Applied", { code, discount });
