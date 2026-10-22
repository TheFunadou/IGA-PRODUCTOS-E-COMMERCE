import { track } from "./MetaEvent";
import { MetaEventObject } from "./MetaEventsTypes";
import {
    createViewContentEvent,
    createAddToCartEvent,
    createInitiateCheckoutEvent,
    createPurchaseEvent
} from "./eventFactory";
import {
    phProductViewed,
    phProductAddedToCart,
    phProductAddedToWishlist,
    phCheckoutStarted,
    phOrderCompleted,
    phProductSearched,
    phSignedUp
} from "./PostHogEvents";

export const trackPageView = () => track(MetaEventObject.PageView);

export const trackViewContent = (product: any) => {
    track(MetaEventObject.ViewContent, createViewContentEvent(product));
    phProductViewed(product);
};

export const trackSearch = (query: string, resultsCount: number = 0) => {
    track(MetaEventObject.Search, { search_string: query, num_items: resultsCount });
    phProductSearched(query, resultsCount);
};

export const trackAddToWishlist = (product: any) => {
    track(MetaEventObject.AddFav, createViewContentEvent(product));
    phProductAddedToWishlist(product);
};

export const trackAddToCart = (
    product: { name: string; sku: string; finalPrice: string },
    quantity: number = 1
) => {
    track(MetaEventObject.AddToCart, createAddToCartEvent({
        productName: product.name,
        skuList: [product.sku],
        price: parseFloat(product.finalPrice),
        currency: "MXN",
        quantity
    }));
    phProductAddedToCart(product, quantity);
};

export const trackInitiateCheckout = (cartTotal: number, numItems: number) => {
    track(MetaEventObject.InitiateCheckout, createInitiateCheckoutEvent(cartTotal, numItems));
    phCheckoutStarted(cartTotal, numItems);
};

export const trackPurchase = (order: any) => {
    track(MetaEventObject.Purchase, createPurchaseEvent(order));
    phOrderCompleted(order);
};

export const trackCompleteRegistration = (method: "email" | "google" = "email") => {
    track(MetaEventObject.CompleteRegistration);
    phSignedUp(method);
};

export const trackLead = (source?: string) =>
    track(MetaEventObject.Lead, source ? { content_name: source } : undefined);
