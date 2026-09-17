import { type RefObject } from "react";
import { FaX } from "react-icons/fa6";
import type { CheckoutAd } from "./CheckoutAds";

type Props = {
    ref: RefObject<HTMLDialogElement | null>;
    ad: CheckoutAd;
};

const AdImageModal = ({ ref, ad }: Props) => (
    <dialog className="modal" ref={ref}>
        <div className="modal-box relative w-auto max-w-[95vw] p-2 sm:p-3 rounded-2xl bg-base-100 border border-base-300">
            <form method="dialog">
                <button
                    type="submit"
                    aria-label="Cerrar"
                    className="btn btn-sm btn-circle absolute right-2 top-2 z-20 bg-base-100/90 border border-base-300 shadow-md text-base-content hover:bg-base-200"
                >
                    <FaX />
                </button>
            </form>
            <img
                src={ad.src}
                alt={ad.alt}
                className="max-h-[85vh] w-auto max-w-full mx-auto object-contain rounded-xl"
            />
        </div>
        <form method="dialog" className="modal-backdrop">
            <button type="submit">close</button>
        </form>
    </dialog>
);

export default AdImageModal;
