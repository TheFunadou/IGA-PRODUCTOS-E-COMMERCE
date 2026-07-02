export const MetaEventObject = {
    PageView: "PageView",
    Search: "Search",
    ViewContent: "ViewContent",
    AddToCart: "AddToCart",
    InitiateCheckout: "InitiateCheckout",
    Purchase: "Purchase",
    Lead: "Lead",
    AddFav: "AddToWishlist",
    CompleteRegistration: "CompleteRegistration"
};

export type MetaEvent = typeof MetaEventObject[keyof typeof MetaEventObject];
