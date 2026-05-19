import { type RefObject, useState, useEffect, useRef, useCallback } from "react";
import {
    FaX,
    FaChevronLeft,
    FaChevronRight,
    FaMagnifyingGlassPlus,
    FaMagnifyingGlassMinus,
} from "react-icons/fa6";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface GalleryImage {
    mainImage: boolean;
    url: string;
}

export interface GalleryItem {
    index: number;
    title: string;
    images: GalleryImage[];
}

interface Props {
    /** Referencia al elemento <dialog> para abrirlo/cerrarlo desde el padre */
    ref: RefObject<HTMLDialogElement | null>;
    /** Ítem activo al abrir la galería */
    activeItem: GalleryItem;
    /** Lista completa de ítems */
    items: GalleryItem[];
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.75;

// ─── Helper: imagen principal de un ítem ─────────────────────────────────────

const getMainImage = (item: GalleryItem): string => {
    const main = item.images.find((img) => img.mainImage);
    return (main ?? item.images[0])?.url ?? "";
};

// ─── Componente ───────────────────────────────────────────────────────────────

const ImageGallery = ({ ref, activeItem, items }: Props) => {
    // Ítem actualmente seleccionado en la barra lateral
    const [currentItem, setCurrentItem] = useState<GalleryItem>(activeItem);
    // URL de la imagen grande visible
    const [selectedUrl, setSelectedUrl] = useState<string>(getMainImage(activeItem));

    // Zoom / pan
    const [zoom, setZoom] = useState(1);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });
    const [isPanning, setIsPanning] = useState(false);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

    const imgContainerRef = useRef<HTMLDivElement>(null);

    // Sincroniza cuando el padre cambia el ítem activo (p. ej. al abrir el modal)
    useEffect(() => {
        setCurrentItem(activeItem);
        setSelectedUrl(getMainImage(activeItem));
        resetZoom();
    }, [activeItem]);

    // ── Zoom helpers ──────────────────────────────────────────────────────────

    const resetZoom = () => {
        setZoom(1);
        setOrigin({ x: 50, y: 50 });
        setPan({ x: 0, y: 0 });
    };

    const zoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
    const zoomOut = () => {
        const next = Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
        setZoom(next);
        if (next === 1) setPan({ x: 0, y: 0 });
    };

    // ── Cambio de ítem ────────────────────────────────────────────────────────

    const selectItem = (item: GalleryItem) => {
        setCurrentItem(item);
        setSelectedUrl(getMainImage(item));
        resetZoom();
    };

    // ── Cambio de imagen dentro del ítem activo ───────────────────────────────

    const changeImage = (url: string) => {
        setSelectedUrl(url);
        resetZoom();
    };

    const imageUrls = currentItem.images.map((img) => img.url);
    const currentIndex = imageUrls.indexOf(selectedUrl);

    const goPrev = () =>
        changeImage(imageUrls[(currentIndex - 1 + imageUrls.length) % imageUrls.length]);
    const goNext = () =>
        changeImage(imageUrls[(currentIndex + 1) % imageUrls.length]);

    // ── Interacción con la imagen (zoom al clic + panning) ────────────────────

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
        [zoom],
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (zoom <= 1) return;
            e.preventDefault();
            setIsPanning(true);
            setLastMouse({ x: e.clientX, y: e.clientY });
        },
        [zoom],
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
        [zoom, isPanning, lastMouse],
    );

    const handleMouseUp = useCallback(() => setIsPanning(false), []);
    const handleMouseLeave = useCallback(() => {
        setIsPanning(false);
        setPan({ x: 0, y: 0 });
    }, []);

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <dialog className="modal" ref={ref}>
            <div className="modal-box w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl p-4 sm:p-6 md:p-8 rounded-2xl bg-base-100 text-base-content">

                {/* Botón cerrar */}
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-20 text-base-content">
                        <FaX />
                    </button>
                </form>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 mt-2">

                    {/* ── GALERÍA ─────────────────────────────────────────── */}
                    <section className="flex flex-col-reverse sm:flex-row gap-3 md:gap-4 flex-1 min-w-0">

                        {/* Thumbnails de la imagen actual */}
                        <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden sm:max-h-[420px] md:max-h-[500px] lg:max-h-[580px] pb-1 sm:pb-0 sm:pr-1 flex-shrink-0">
                            {currentItem.images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => changeImage(img.url)}
                                    className={`
                                        flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200
                                        w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20
                                        hover:border-primary hover:scale-105
                                        ${img.url === selectedUrl
                                            ? "border-primary shadow-md shadow-primary/20"
                                            : "border-base-300 hover:border-primary/60"}
                                    `}
                                >
                                    <img
                                        src={img.url}
                                        alt={`${currentItem.title} vista ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Indicador de imagen principal */}
                                    {img.mainImage && (
                                        <span className="sr-only">Imagen principal</span>
                                    )}
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
                                    key={selectedUrl}
                                    src={selectedUrl}
                                    alt={currentItem.title}
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

                                {/* Contador de imágenes */}
                                <div className="absolute top-3 left-3 bg-base-content/50 text-base-100 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                                    {currentIndex + 1} / {imageUrls.length}
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

                            {/* Flechas de navegación entre imágenes */}
                            {imageUrls.length > 1 && (
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

                    {/* ── PANEL LATERAL ───────────────────────────────────── */}
                    <section className="flex flex-col gap-4 md:w-56 lg:w-64 xl:w-72 flex-shrink-0">

                        {/* Título del ítem actual */}
                        <div>
                            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight text-base-content">
                                {currentItem.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-base-content/50 mt-1">
                                Ítem {currentItem.index + 1} de {items.length}
                            </p>
                        </div>

                        <div className="divider my-0" />

                        {/* Dots de imágenes dentro del ítem */}
                        {imageUrls.length > 1 && (
                            <div>
                                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-base-content/40 font-semibold mb-2">
                                    Vistas
                                </p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {imageUrls.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => changeImage(url)}
                                            className={`h-2 rounded-full transition-all duration-200 ${
                                                url === selectedUrl
                                                    ? "bg-primary w-5"
                                                    : "bg-base-300 w-2 hover:bg-base-content/40"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="divider my-0" />

                        {/* Lista de ítems navegables — solo si hay más de uno */}
                        {items.length > 1 && (
                            <div>
                                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-base-content/40 font-semibold mb-2">
                                    Galería
                                </p>
                                <ul className="flex flex-col gap-2 overflow-y-auto max-h-52 pr-1">
                                    {items.map((item) => {
                                        const thumb = getMainImage(item);
                                        const isActive = item.index === currentItem.index;
                                        return (
                                            <li key={item.index}>
                                                <button
                                                    type="button"
                                                    onClick={() => selectItem(item)}
                                                    className={`
                                                        w-full flex items-center gap-3 rounded-xl px-2 py-1.5 text-left
                                                        transition-all duration-200
                                                        ${isActive
                                                            ? "bg-primary/10 ring-1 ring-primary"
                                                            : "hover:bg-base-200"}
                                                    `}
                                                >
                                                    {/* Thumbnail del ítem */}
                                                    <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-base-300">
                                                        {thumb ? (
                                                            <img
                                                                src={thumb}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-base-300 flex items-center justify-center text-base-content/30 text-xs">
                                                                ?
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`text-xs sm:text-sm font-medium truncate ${
                                                                isActive
                                                                    ? "text-primary"
                                                                    : "text-base-content"
                                                            }`}
                                                        >
                                                            {item.title}
                                                        </p>
                                                        <p className="text-[10px] text-base-content/40">
                                                            {item.images.length}{" "}
                                                            {item.images.length === 1
                                                                ? "imagen"
                                                                : "imágenes"}
                                                        </p>
                                                    </div>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button type="submit">close</button>
            </form>
        </dialog>
    );
};

export default ImageGallery;