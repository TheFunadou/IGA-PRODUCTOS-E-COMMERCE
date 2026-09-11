import { useState } from "react";
import { SIDE_ADS } from "./SideAds";

const SideAdBanner = () => {
    const [index] = useState(() => Math.floor(Math.random() * SIDE_ADS.length));
    const ad = SIDE_ADS[index];
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

export default SideAdBanner;