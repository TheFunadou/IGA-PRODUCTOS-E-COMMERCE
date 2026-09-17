import { useRef, useState } from "react";
import { showModal } from "../../../global/GlobalHelpers";
import AdImageModal from "./AdImageModal";
import { SIDE_ADS } from "./SideAds";

const SideAdBanner = () => {
    const [index] = useState(() => Math.floor(Math.random() * SIDE_ADS.length));
    const modalRef = useRef<HTMLDialogElement>(null);
    const ad = SIDE_ADS[index];
    if (!ad) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => showModal(modalRef.current)}
                aria-label={`Ampliar imagen: ${ad.alt}`}
                className="w-full cursor-zoom-in rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <img
                    src={ad.src}
                    alt={ad.alt}
                    loading="lazy"
                    className="w-full h-auto rounded-2xl border border-base-300 bg-base-100"
                />
            </button>
            <AdImageModal ref={modalRef} ad={ad} />
        </>
    );
};

export default SideAdBanner;
