import type { ProductVersionCardI } from "../products/ProductTypes";
import { track } from "./MetaEvent";
import { MetaEventObject } from "./MetaEventsTypes";
import {
    createViewContentEvent,
    createAddToCartEvent,
    createInitiateCheckoutEvent,
    createPurchaseEvent
} from "./eventFactory";

export const trackPageView = () => track(MetaEventObject.PageView);

export const trackViewContent = (product: any) =>
    track(MetaEventObject.ViewContent, createViewContentEvent(product));

export const trackSearch = (query: string, resultsCount: number = 0) =>
    track(MetaEventObject.Search, { search_string: query, num_items: resultsCount });

export const trackAddToWishlist = (product: any) =>
    track(MetaEventObject.AddFav, createViewContentEvent(product));

export const trackAddToCart = (product: ProductVersionCardI, quantity: number = 1) =>
    track(MetaEventObject.AddToCart, createAddToCartEvent({
        productName: product.name,
        skuList: [product.sku],
        price: parseFloat(product.finalPrice),
        currency: "MXN",
        quantity
    }));

export const trackInitiateCheckout = (cartTotal: number, numItems: number) =>
    track(MetaEventObject.InitiateCheckout, createInitiateCheckoutEvent(cartTotal, numItems));

export const trackPurchase = (order: any) =>
    track(MetaEventObject.Purchase, createPurchaseEvent(order));

export const trackCompleteRegistration = () =>
    track(MetaEventObject.CompleteRegistration);

export const trackLead = (source?: string) =>
    track(MetaEventObject.Lead, source ? { content_name: source } : undefined);
