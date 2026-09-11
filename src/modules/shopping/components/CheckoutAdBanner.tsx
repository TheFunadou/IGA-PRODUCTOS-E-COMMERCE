import { useState } from "react";
import { CHECKOUT_ADS } from "./CheckoutAds";

const CheckoutAdBanner = () => {
    const [index] = useState(() => Math.floor(Math.random() * CHECKOUT_ADS.length));
    const ad = CHECKOUT_ADS[index];
    if (!ad) return null;

    const content = (
        <img
            src={ad.src}
            alt={ad.alt}
            loading="lazy"
            className="w-full h-auto rounded-2xl border border-base-300 bg-base-100"
        />
    );

    if (ad.href) {
        return (
            <a href={ad.href} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return content;
};

export default CheckoutAdBanner;