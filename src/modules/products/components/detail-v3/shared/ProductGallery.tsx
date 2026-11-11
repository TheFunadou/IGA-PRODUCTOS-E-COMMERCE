import clsx from "clsx";
import { FaStar } from "react-icons/fa6";
import { FaCirclePlay } from "react-icons/fa6";
import ImageZoomViewer from "../../ImageZoomViewer";
import { showModal } from "../../../../../global/GlobalHelpers";
import type { ProductVersionDetailV3I, PVDetailMedia } from "../../../ProductTypes";

/* Galería de media: badge de oferta + badge SKU (mobile) + visor con zoom
   (abre el modal de galería) + fila de miniaturas con scroll-x horizontal.
   Cada ítem puede ser imagen o video (mediaType). */
interface ProductGalleryProps {
    data: ProductVersionDetailV3I;
    selectedMedia?: PVDetailMedia;
    sortedMedia: PVDetailMedia[];
    onSelectMedia: (media: PVDetailMedia) => void;
    galleryModalRef: React.RefObject<HTMLDialogElement | null>;
}

const ProductGallery = ({ data, selectedMedia, sortedMedia, onSelectMedia, galleryModalRef }: ProductGalleryProps) => {
    const isVideo = selectedMedia?.mediaType === "video";

    return (
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
                {isVideo ? (
                    /* Video: se reproduce solo al seleccionarlo (autoplay muted,
                       el usuario puede activar el sonido con los controles) */
                    <video
                        key={selectedMedia!.url}
                        src={selectedMedia!.url}
                        className="w-full rounded-2xl bg-black object-contain"
                        autoPlay
                        muted
                        playsInline
                        controls
                    />
                ) : (
                    <ImageZoomViewer
                        image_url={selectedMedia?.url ?? ""}
                        alt={data.name}
                        onClick={() => showModal(galleryModalRef.current)}
                    />
                )}
            </div>

            {sortedMedia.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {sortedMedia.map((media, index) => (
                        <button
                            key={`${media.url}-${index}`}
                            type="button"
                            onClick={() => onSelectMedia(media)}
                            aria-label={media.mediaType === "video" ? `Ver video ${index + 1}` : `Ver imagen ${index + 1}`}
                            className={clsx(
                                "w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] shrink-0 rounded-2xl overflow-hidden border-2 bg-white transition-all duration-300 relative",
                                media.url === selectedMedia?.url
                                    ? "border-primary shadow-md ring-2 ring-primary/20 ring-offset-2 scale-105"
                                    : "border-base-200 opacity-70 hover:opacity-100 hover:border-primary/50 hover:scale-105"
                            )}
                        >
                            {media.mediaType === "video" ? (
                                <>
                                    <video
                                        src={media.url}
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                        preload="metadata"
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="bg-black/55 text-white rounded-full p-1.5">
                                            <FaCirclePlay className="text-sm" />
                                        </span>
                                    </span>
                                </>
                            ) : (
                                <img
                                    className="w-full h-full object-contain p-1.5"
                                    src={media.url}
                                    alt={`${data.name} imagen ${index + 1}`}
                                    loading="lazy"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
