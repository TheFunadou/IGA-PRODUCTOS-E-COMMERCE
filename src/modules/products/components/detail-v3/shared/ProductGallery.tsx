import clsx from "clsx";
import { FaStar } from "react-icons/fa6";
import ImageZoomViewer from "../../ImageZoomViewer";
import { showModal } from "../../../../../global/GlobalHelpers";
import type { ProductVersionDetailV3I } from "../../../ProductTypes";

/* Galería de imágenes: badge de oferta + badge SKU (mobile) + visor con zoom
   (abre el modal de galería) + fila de miniaturas con scroll-x horizontal. */
interface ProductGalleryProps {
    data: ProductVersionDetailV3I;
    image?: string;
    sortedImageUrls: string[];
    onSelectImage: (url: string) => void;
    galleryModalRef: React.RefObject<HTMLDialogElement | null>;
}

const ProductGallery = ({ data, image, sortedImageUrls, onSelectImage, galleryModalRef }: ProductGalleryProps) => (
    <div className="lg:sticky lg:top-16 flex flex-col gap-3">
        <div className="relative w-full rounded-2xl">
            {data.offer?.isOffer && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex gap-1.5 items-center shadow-lg bg-error">
                    <FaStar className="text-white text-xs" />
                    <p className="text-xs font-extrabold text-white tracking-wide">-{data.offer.discount}%</p>
                </div>
            )}
            {/* SKU (mobile): badge flotante sobre la imagen, en la esquina
                superior izquierda (debajo del badge de oferta si existe) */}
            <div className={clsx(
                "absolute z-10 lg:hidden px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm pointer-events-none",
                "bg-base-content/60 text-base-100 text-[11px] font-mono font-bold tracking-wide",
                data.offer?.isOffer ? "top-14 left-4" : "top-4 left-4"
            )}>
                {data.sku}
            </div>
            <ImageZoomViewer
                image_url={image!}
                alt={data.name}
                onClick={() => showModal(galleryModalRef.current)}
            />
        </div>

        {sortedImageUrls.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {sortedImageUrls.map((url, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onSelectImage(url)}
                        aria-label={`Ver imagen ${index + 1}`}
                        className={clsx(
                            "w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] shrink-0 rounded-2xl overflow-hidden border-2 bg-white transition-all duration-300",
                            url === image
                                ? "border-primary shadow-md ring-2 ring-primary/20 ring-offset-2 scale-105"
                                : "border-base-200 opacity-70 hover:opacity-100 hover:border-primary/50 hover:scale-105"
                        )}
                    >
                        <img
                            className="w-full h-full object-contain p-1.5"
                            src={url}
                            alt={`${data.name} imagen ${index + 1}`}
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>
        )}
    </div>
);

export default ProductGallery;
