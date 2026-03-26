import { type RefObject, useState, useEffect, useRef, useCallback } from "react";
import {
    FaX,
    FaChevronLeft,
    FaChevronRight,
    FaMagnifyingGlassPlus,
    FaMagnifyingGlassMinus,
} from "react-icons/fa6";

// ── Tipos ──────────────────────────────────────────────────────────────────────

export interface GalleryImage {
    index: number;
    description: string;
    image_url: string;
}

export interface GalleryData {
    galleryName: string;
    images: GalleryImage[];
}

interface Props {
    ref: RefObject<HTMLDialogElement | null>;
    /** Imagen que se muestra al abrir el modal (por image_url). Si no se pasa, se usa la primera. */
    currentImageUrl?: string;
    gallery: GalleryData;
}

// ── Constantes de zoom ────────────────────────────────────────────────────────

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.75;

// ── Componente ────────────────────────────────────────────────────────────────

const ImageGallery = ({
    ref,
    currentImageUrl,
    gallery: { galleryName, images },
}: Props) => {
    // La imagen seleccionada es el objeto GalleryImage completo
    const [selected, setSelected] = useState<GalleryImage>(
        () =>
            images.find((img) => img.image_url === currentImageUrl) ?? images[0]
    );

    const [zoom, setZoom] = useState(1);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });
    const [isPanning, setIsPanning] = useState(false);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

    const imgContainerRef = useRef<HTMLDivElement>(null);

    // Sincroniza si el padre cambia la imagen inicial
    useEffect(() => {
        const found =
            images.find((img) => img.image_url === currentImageUrl) ?? images[0];
        setSelected(found);
        resetZoom();
    }, [currentImageUrl]);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const resetZoom = () => {
        setZoom(1);
        setOrigin({ x: 50, y: 50 });
        setPan({ x: 0, y: 0 });
    };

    const changeImage = (img: GalleryImage) => {
        setSelected(img);
        resetZoom();
    };

    const sortedImages = [...images].sort((a, b) => a.index - b.index);
    const currentIdx = sortedImages.findIndex(
        (img) => img.image_url === selected.image_url
    );

    const goPrev = () =>
        changeImage(
            sortedImages[(currentIdx - 1 + sortedImages.length) % sortedImages.length]
        );
    const goNext = () =>
        changeImage(sortedImages[(currentIdx + 1) % sortedImages.length]);

    const zoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
    const zoomOut = () => {
        const next = Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
        setZoom(next);
        if (next === 1) setPan({ x: 0, y: 0 });
    };

    // ── Interacciones con la imagen ────────────────────────────────────────────

    const handleImageClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (zoom > 1) {
                resetZoom();
                return;
            }
            const rect = e.currentTarget.getBoundingClientRect();
            const xPct = ((e.clientX - rect.left) / rect.width) * 100;
            const yPct = ((e.clientY - rect.top) / rect.height) * 100;
            setOrigin({ x: xPct, y: yPct });
            setZoom(2);
            setPan({ x: 0, y: 0 });
        },
        [zoom]
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (zoom <= 1) return;
            e.preventDefault();
            setIsPanning(true);
            setLastMouse({ x: e.clientX, y: e.clientY });
        },
        [zoom]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (zoom <= 1) return;
            const rect = imgContainerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const relX = (e.clientX - rect.left) / rect.width;
            const relY = (e.clientY - rect.top) / rect.height;
            const maxPanX = (rect.width * (zoom - 1)) / 2;
            const maxPanY = (rect.height * (zoom - 1)) / 2;
            const targetX = -(relX - 0.5) * 2 * maxPanX;
            const targetY = -(relY - 0.5) * 2 * maxPanY;

            setPan({ x: targetX, y: targetY });

            if (isPanning) {
                const dx = e.clientX - lastMouse.x;
                const dy = e.clientY - lastMouse.y;
                setLastMouse({ x: e.clientX, y: e.clientY });
                setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
            }
        },
        [zoom, isPanning, lastMouse]
    );

    const handleMouseUp = useCallback(() => setIsPanning(false), []);
    const handleMouseLeave = useCallback(() => {
        setIsPanning(false);
        setPan({ x: 0, y: 0 });
    }, []);

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <dialog className="modal" ref={ref}>
            <div className="modal-box w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl p-4 sm:p-6 md:p-8 rounded-2xl bg-base-100 text-base-content">
                {/* Cerrar */}
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-20 text-base-content">
                        <FaX />
                    </button>
                </form>

                {/* Nombre de la galería */}
                <h2 className="text-base sm:text-lg font-semibold text-base-content/70 mb-4 pr-8">
                    {galleryName}
                </h2>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
                    {/* ── GALERÍA ── */}
                    <section className="flex flex-col-reverse sm:flex-row gap-3 md:gap-4 flex-1 min-w-0">
                        {/* Thumbnails */}
                        <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden sm:max-h-[420px] md:max-h-[500px] lg:max-h-[580px] pb-1 sm:pb-0 sm:pr-1 flex-shrink-0">
                            {sortedImages.map((img) => (
                                <button
                                    key={img.index}
                                    type="button"
                                    onClick={() => changeImage(img)}
                                    className={`
                                        flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200
                                        w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20
                                        hover:border-primary hover:scale-105
                                        ${img.image_url === selected.image_url
                                            ? "border-primary shadow-md shadow-primary/20"
                                            : "border-base-300 hover:border-primary/60"}
                                    `}
                                    title={img.description}
                                >
                                    <img
                                        src={img.image_url}
                                        alt={img.description}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Imagen principal */}
                        <div className="relative flex-1 min-w-0">
                            <div
                                ref={imgContainerRef}
                                onClick={handleImageClick}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                className={`
                                    relative w-full overflow-hidden rounded-xl
                                    bg-base-200 border border-base-300
                                    aspect-square md:aspect-[4/3] lg:aspect-square
                                    select-none
                                    ${zoom > 1
                                        ? isPanning
                                            ? "cursor-grabbing"
                                            : "cursor-zoom-out"
                                        : "cursor-zoom-in"}
                                `}
                            >
                                <img
                                    key={selected.image_url}
                                    src={selected.image_url}
                                    alt={selected.description}
                                    draggable={false}
                                    className="w-full h-full object-contain transition-transform duration-300 ease-out pointer-events-none"
                                    style={{
                                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                                        transformOrigin:
                                            zoom === 1
                                                ? "center center"
                                                : `${origin.x}% ${origin.y}%`,
                                    }}
                                />

                                {/* Hint zoom */}
                                {zoom === 1 && (
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-base-content/60 text-base-100 text-[10px] sm:text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none whitespace-nowrap">
                                        Clic para hacer zoom
                                    </div>
                                )}

                                {/* Contador */}
                                <div className="absolute top-3 left-3 bg-base-content/50 text-base-100 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                                    {currentIdx + 1} / {sortedImages.length}
                                </div>
                            </div>

                            {/* Controles de zoom */}
                            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
                                <button
                                    type="button"
                                    onClick={zoomIn}
                                    disabled={zoom >= MAX_ZOOM}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-100/90 border border-base-300 shadow-md backdrop-blur-sm flex items-center justify-center hover:bg-base-200 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-base-content"
                                    aria-label="Zoom in"
                                >
                                    <FaMagnifyingGlassPlus className="text-xs sm:text-sm" />
                                </button>
                                <button
                                    type="button"
                                    onClick={zoomOut}
                                    disabled={zoom <= MIN_ZOOM}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-100/90 border border-base-300 shadow-md backdrop-blur-sm flex items-center justify-center hover:bg-base-200 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-base-content"
                                    aria-label="Zoom out"
                                >
                                    <FaMagnifyingGlassMinus className="text-xs sm:text-sm" />
                                </button>
                                {zoom > 1 && (
                                    <div className="text-center text-[10px] font-semibold text-base-content/60">
                                        {zoom.toFixed(1)}x
                                    </div>
                                )}
                            </div>

                            {/* Flechas de navegación */}
                            {sortedImages.length > 1 && (
                                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
                                    <button
                                        type="button"
                                        onClick={goPrev}
                                        className="pointer-events-auto w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-100/80 border border-base-300 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-base-200 hover:scale-110 transition-all duration-200 text-base-content"
                                    >
                                        <FaChevronLeft className="text-xs sm:text-sm" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        className="pointer-events-auto w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-100/80 border border-base-300 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-base-200 hover:scale-110 transition-all duration-200 text-base-content"
                                    >
                                        <FaChevronRight className="text-xs sm:text-sm" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── INFO DE LA IMAGEN SELECCIONADA ── */}
                    <section className="flex flex-col gap-4 md:w-56 lg:w-64 xl:w-72 flex-shrink-0">
                        {/* Índice + Descripción */}
                        <div>
                            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-base-content/40 font-semibold mb-1">
                                Imagen {selected.index}
                            </p>
                            <p className="text-sm sm:text-base text-base-content leading-relaxed">
                                {selected.description}
                            </p>
                        </div>

                        <div className="divider my-0" />

                        {/* Dots de navegación */}
                        {sortedImages.length > 1 && (
                            <div className="flex gap-1.5 flex-wrap">
                                {sortedImages.map((img) => (
                                    <button
                                        key={img.index}
                                        type="button"
                                        onClick={() => changeImage(img)}
                                        title={img.description}
                                        className={`h-2 rounded-full transition-all duration-200 ${img.image_url === selected.image_url
                                                ? "bg-primary w-5"
                                                : "bg-base-300 w-2 hover:bg-base-content/40"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Cierre al hacer clic fuera */}
            <form method="dialog" className="modal-backdrop">
                <button type="submit">close</button>
            </form>
        </dialog>
    );
};

export default ImageGallery;