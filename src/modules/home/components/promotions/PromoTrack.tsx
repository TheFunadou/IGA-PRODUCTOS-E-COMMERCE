import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

type Props = {
    children: ReactNode;
    /** Alto fijo del track (Tailwind). Default: h-[420px] sm:h-[480px]. */
    height?: string;
    className?: string;
};

const DEFAULT_HEIGHT = "h-[420px] sm:h-[480px]";

/**
 * Pista de carrusel estética para tiles promocionales:
 * flex gap-2, scrollbar nativa oculta, snap, y flechas laterales que solo
 * aparecen cuando los tiles desbordan el contenedor. Cada hijo debe llevar
 * h-full para heredar el alto fijo y shrink-0 para conservar su aspecto.
 */
const PromoTrack = ({ children, height = DEFAULT_HEIGHT, className }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScroll, setCanScroll] = useState(false);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        setCanScroll(maxScroll > 1);
        setAtStart(el.scrollLeft <= 1);
        setAtEnd(el.scrollLeft >= maxScroll - 1);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        // Revalora al redimensionar el contenedor (responsive)...
        const resizeObserver = new ResizeObserver(updateScrollState);
        resizeObserver.observe(el);
        // ...y cuando se agregan/quitan tiles (secciones con contenido condicional).
        const mutationObserver = new MutationObserver(updateScrollState);
        mutationObserver.observe(el, { childList: true });
        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [updateScrollState]);

    const handleScrollStep = (direction: 1 | -1) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.8, 240), behavior: "smooth" });
    };

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                onScroll={updateScrollState}
                className={clsx(
                    "flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-8 lg:px-20 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]",
                    height,
                    className
                )}
            >
                {children}
                {/* Spacer: garantiza el padding final al hacer scroll (limitación de flex+overflow) */}
                <div className="w-1 shrink-0" aria-hidden />
            </div>

            {canScroll && (
                <>
                    <button
                        type="button"
                        aria-label="Promoción anterior"
                        disabled={atStart}
                        onClick={() => handleScrollStep(-1)}
                        className="btn btn-circle btn-sm absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 border-base-300 bg-base-100 disabled:opacity-30"
                    >
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <button
                        type="button"
                        aria-label="Promoción siguiente"
                        disabled={atEnd}
                        onClick={() => handleScrollStep(1)}
                        className="btn btn-circle btn-sm absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 border-base-300 bg-base-100 disabled:opacity-30"
                    >
                        <FaChevronRight className="text-xs" />
                    </button>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-base-100 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l from-base-100 to-transparent" />
                </>
            )}
        </div>
    );
};

export default PromoTrack;
