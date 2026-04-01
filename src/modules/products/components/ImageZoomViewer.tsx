import { useRef, useState, useCallback } from "react";
import clsx from "clsx";

type Props = {
    image_url: string;
    alt: string;
    onClick: () => void;
};

type Position = { x: number; y: number };

const ZOOM_LEVEL = 2.5;
const LENS_SIZE_PX = 100;

const ImageZoomViewer = ({ image_url, alt, onClick }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [cursor, setCursor] = useState<Position>({ x: 0, y: 0 });
    const [zoomPos, setZoomPos] = useState<Position>({ x: 50, y: 50 });

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

    return (
        <div
            className="flex flex-col items-center gap-3 w-full sm:flex-row sm:items-start sm:gap-4 md:gap-6"
            onClick={onClick}
        >
            {/* ── IMAGEN PRINCIPAL + LENTE ── */}
            <div
                ref={containerRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
                className={clsx(
                    "relative overflow-hidden rounded-2xl border-2 border-gray-200",
                    "bg-base-100 select-none shrink-0",
                    "w-full aspect-square",
                    "sm:w-64 sm:h-64",
                    "md:w-80 md:h-80",
                    "lg:w-96 lg:h-96",
                    "xl:w-[28rem] xl:h-[28rem]",
                    "2xl:w-[32rem] 2xl:h-[32rem]",
                    "cursor-crosshair shadow-md transition-shadow duration-200 hover:shadow-xl"
                )}
            >
                <img
                    src={image_url}
                    alt={alt}
                    draggable={false}
                    className="w-full h-full object-contain pointer-events-none"
                />

                {/* Círculo lente */}
                {isHovering && (
                    <div
                        className="absolute pointer-events-none rounded-full border-2 border-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_4px_24px_rgba(0,0,0,0.18)]"
                        style={{
                            width: LENS_SIZE_PX,
                            height: LENS_SIZE_PX,
                            left: cursor.x - LENS_SIZE_PX / 2,
                            top: cursor.y - LENS_SIZE_PX / 2,
                            background: "rgba(255,255,255,0.18)",
                        }}
                    />
                )}

                {isHovering && (
                    <div className="absolute inset-0 bg-black/5 pointer-events-none rounded-2xl" />
                )}
            </div>

            {/* ── PANEL ZOOM — solo visible al hacer hover ── */}
            {isHovering && (
                <div
                    className={clsx(
                        "rounded-2xl border border-primary/50 overflow-hidden shrink-0 shadow-lg",
                        "w-full aspect-square",
                        "sm:w-64 sm:h-64",
                        "md:w-80 md:h-80",
                        "lg:w-96 lg:h-96",
                        "xl:w-[28rem] xl:h-[28rem]",
                        "2xl:w-[32rem] 2xl:h-[32rem]",
                        "animate-in fade-in zoom-in-95 duration-150 bg-base-100 z-100"
                    )}
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
                </div>
            )}
        </div>
    );
};

export default ImageZoomViewer;