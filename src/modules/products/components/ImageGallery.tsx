import { type RefObject, useState, useEffect, useRef, useCallback } from "react";
import { FaX, FaChevronLeft, FaChevronRight, FaMagnifyingGlassPlus, FaMagnifyingGlassMinus } from "react-icons/fa6";

interface Props {
    ref: RefObject<HTMLDialogElement | null>;
    currentImage: string;
    images: string[];
    productData: {
        productName: string;
        subcategories: string[];
        colorLine: string;
        colorName: string;
        colorCode: string;
    };
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.75;

const ImageGallery = ({
    ref,
    currentImage,
    images,
    productData: { productName, subcategories, colorLine, colorName, colorCode },
}: Props) => {
    const [selected, setSelected] = useState(currentImage);
    const [zoom, setZoom] = useState(1);
    const [origin, setOrigin] = useState({ x: 50, y: 50 }); // % para transform-origin
    const [isPanning, setIsPanning] = useState(false);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
    const imgContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelected(currentImage);
        resetZoom();
    }, [currentImage]);

    const resetZoom = () => {
        setZoom(1);
        setOrigin({ x: 50, y: 50 });
        setPan({ x: 0, y: 0 });
    };

    const changeImage = (img: string) => {
        setSelected(img);
        resetZoom();
    };

    const currentIndex = images.indexOf(selected);

    const goPrev = () => changeImage(images[(currentIndex - 1 + images.length) % images.length]);
    const goNext = () => changeImage(images[(currentIndex + 1) % images.length]);

    const zoomIn = () => setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM));
    const zoomOut = () => {
        const next = Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
        setZoom(next);
        if (next === 1) setPan({ x: 0, y: 0 });
    };

    // Clic sobre la imagen: activa/desactiva zoom y centra en el punto clicado
    const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
    }, [zoom]);

    // Panning con mouse mientras hay zoom
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (zoom <= 1) return;
        e.preventDefault();
        setIsPanning(true);
        setLastMouse({ x: e.clientX, y: e.clientY });
    }, [zoom]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (zoom <= 1) return;

        // Navegación suave solo con mover el cursor (sin click sostenido)
        const rect = imgContainerRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Posición del cursor relativa al contenedor (0 a 1)
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;

        // Rango máximo de desplazamiento en px según el nivel de zoom
        const maxPanX = (rect.width * (zoom - 1)) / 2;
        const maxPanY = (rect.height * (zoom - 1)) / 2;

        // Mapea la posición del cursor al rango [-maxPan, +maxPan]
        const targetX = -(relX - 0.5) * 2 * maxPanX;
        const targetY = -(relY - 0.5) * 2 * maxPanY;

        setPan({ x: targetX, y: targetY });

        // Si además tiene el botón presionado, también actualiza lastMouse para el drag
        if (isPanning) {
            const dx = e.clientX - lastMouse.x;
            const dy = e.clientY - lastMouse.y;
            setLastMouse({ x: e.clientX, y: e.clientY });
            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
        }
    }, [zoom, isPanning, lastMouse]);

    const handleMouseUp = useCallback(() => setIsPanning(false), []);
    const handleMouseLeave = useCallback(() => {
        setIsPanning(false);
        // Al salir del contenedor, centra la imagen suavemente
        setPan({ x: 0, y: 0 });
    }, []);

    return (
        <dialog className="modal" ref={ref}>
            <div className="modal-box w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl p-4 sm:p-6 md:p-8 rounded-2xl bg-base-100 text-base-content">

                {/* Close */}
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-20 text-base-content">
                        <FaX />
                    </button>
                </form>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 mt-2">

                    {/* ── GALERÍA ── */}
                    <section className="flex flex-col-reverse sm:flex-row gap-3 md:gap-4 flex-1 min-w-0">

                        {/* Thumbnails */}
                        <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden sm:max-h-[420px] md:max-h-[500px] lg:max-h-[580px] pb-1 sm:pb-0 sm:pr-1 flex-shrink-0">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => changeImage(img)}
                                    className={`
                                        flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200
                                        w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20
                                        hover:border-primary hover:scale-105
                                        ${img === selected
                                            ? "border-primary shadow-md shadow-primary/20"
                                            : "border-base-300 hover:border-primary/60"}
                                    `}
                                >
                                    <img src={img} alt={`${productName} vista ${i + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Imagen principal */}
                        <div className="relative flex-1 min-w-0">
                            {/* Contenedor con overflow hidden para el crop del zoom */}
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
                                    ${zoom > 1 ? (isPanning ? "cursor-grabbing" : "cursor-zoom-out") : "cursor-zoom-in"}
                                `}
                            >
                                <img
                                    key={selected}
                                    src={selected}
                                    alt={productName}
                                    draggable={false}
                                    className="w-full h-full object-contain transition-transform duration-300 ease-out pointer-events-none"
                                    style={{
                                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                                        transformOrigin: zoom === 1 ? "center center" : `${origin.x}% ${origin.y}%`,
                                    }}
                                />

                                {/* Hint cuando zoom = 1 */}
                                {zoom === 1 && (
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-base-content/60 text-base-100 text-[10px] sm:text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none whitespace-nowrap">
                                        Clic para hacer zoom
                                    </div>
                                )}

                                {/* Contador */}
                                <div className="absolute top-3 left-3 bg-base-content/50 text-base-100 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                                    {currentIndex + 1} / {images.length}
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

                                {/* Indicador de nivel */}
                                {zoom > 1 && (
                                    <div className="text-center text-[10px] font-semibold text-base-content/60">
                                        {zoom.toFixed(1)}x
                                    </div>
                                )}
                            </div>

                            {/* Flechas navegación */}
                            {images.length > 1 && (
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

                    {/* ── INFO DEL PRODUCTO ── */}
                    <section className="flex flex-col gap-4 md:w-56 lg:w-64 xl:w-72 flex-shrink-0">

                        <div>
                            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight text-base-content">
                                {productName}
                            </h2>
                            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                                {subcategories.join(", ")}
                            </p>
                        </div>

                        <div className="divider my-0" />

                        <div>
                            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-base-content/40 font-semibold mb-1">
                                Línea
                            </p>
                            <p className="text-sm sm:text-base font-medium text-base-content">
                                {colorLine}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-base-content/40 font-semibold mb-2">
                                Color
                            </p>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-base-100 shadow-md ring-2 ring-base-300 flex-shrink-0"
                                    style={{ backgroundColor: colorCode }}
                                />
                                <div>
                                    <p className="text-sm sm:text-base font-semibold text-base-content">
                                        {colorName}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-base-content/40 font-mono uppercase">
                                        {colorCode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="divider my-0" />

                        {/* Dots */}
                        {images.length > 1 && (
                            <div className="flex gap-1.5 flex-wrap">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => changeImage(img)}
                                        className={`h-2 rounded-full transition-all duration-200 ${img === selected
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

            <form method="dialog" className="modal-backdrop">
                <button type="submit">close</button>
            </form>
        </dialog>
    );
};

export default ImageGallery;