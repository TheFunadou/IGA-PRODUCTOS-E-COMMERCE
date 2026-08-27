import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type Props = {
    image_url: string;
    alt: string;
    onClick: () => void;
};

type Position = { x: number; y: number };

const ZOOM_LEVEL = 2.5;
const LENS_SIZE_PX = 120;

const ImageZoomViewer = ({ image_url, alt, onClick }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [cursor, setCursor] = useState<Position>({ x: 0, y: 0 });
    const [zoomPos, setZoomPos] = useState<Position>({ x: 50, y: 50 });
    const [containerRect, setContainerRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCursor({ x, y });

        const xPct = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        const yPct = Math.min(Math.max((y / rect.height) * 100, 0), 100);
        setZoomPos({ x: xPct, y: yPct });
    }, []);

    useEffect(() => {
        if (!isHovering) { setContainerRect(null); return; }
        const el = containerRef.current;
        if (!el) return;
        const update = () => {
            const r = el.getBoundingClientRect();
            setContainerRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update, { passive: true });
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [isHovering]);

    return (
        <div className="relative w-full group" onClick={onClick}>
            {/* ── IMAGEN PRINCIPAL ── */}
            <div
                ref={containerRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
                className={clsx(
                    "relative overflow-hidden rounded-3xl border-2 border-base-300 bg-white",
                    "select-none w-full aspect-square cursor-crosshair",
                    "shadow-sm transition-all duration-500 hover:shadow-2xl group-hover:border-primary/30",
                    "flex items-center justify-center"
                )}
            >
                <img
                    src={image_url}
                    alt={alt}
                    draggable={false}
                    className="w-full h-full object-contain pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                />

                {/* Lente (Solo visible en desktop/hover) */}
                {isHovering && (
                    <div
                        className="absolute pointer-events-none rounded-full border-2 border-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_12px_48px_rgba(0,0,0,0.2)] hidden lg:block"
                        style={{
                            width: LENS_SIZE_PX,
                            height: LENS_SIZE_PX,
                            left: cursor.x - LENS_SIZE_PX / 2,
                            top: cursor.y - LENS_SIZE_PX / 2,
                            background: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(4px)",
                        }}
                    />
                )}

                {/* Overlay sutil de interacción */}
                {isHovering && (
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-300" />
                )}
            </div>

            {/* ── PANEL ZOOM (Portal — escapes grid stacking context) ── */}
            {isHovering && containerRect && createPortal(
                <div
                    className="fixed z-[9999] overflow-hidden bg-white shadow-2xl rounded-3xl border border-primary/20 pointer-events-none"
                    style={{
                        top: containerRect.top,
                        left: containerRect.left + containerRect.width + 24,
                        width: containerRect.width,
                        height: containerRect.height,
                    }}
                >
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url(${image_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: `${ZOOM_LEVEL * 100}%`,
                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        }}
                    />
                </div>,
                document.body
            )}

            {/* Indicador visual móvil/tablet */}
            <div className="mt-3 flex justify-center lg:hidden">
                <span className="text-[11px] font-bold text-primary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                    Tocar para ampliar
                </span>
            </div>
        </div>
    );
};

export default ImageZoomViewer;
