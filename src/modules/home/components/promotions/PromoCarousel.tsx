import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

/** Forma base de todo item del tile promocional. El genérico permite extenderla por consumidor. */
export type PromoCarouselItem = {
    id: string;
    imageUrl: string;
    /** Badge de descuento: numérico se renderiza como "-30%"; string se muestra tal cual. */
    offDisc?: string | number;
    /** Si se provee, el item se navega como link. */
    href?: string;
};

type Props<T extends PromoCarouselItem> = {
    titulo: string;
    subtitulo?: string;
    content: T[];
    /** Color sólido de fondo (Tailwind, ej. "bg-red-800"). Ignorado si se provee backgroundImg. */
    backgroundColor?: string;
    /** Imagen de fondo (asset 16:9 recomendado). Sustituye al color sólido; aplica overlay suave. */
    backgroundImg?: string;
    /** Aspecto ESTÁNDAR de la tarjeta: "9/16" (default) o "16/9". El ancho lo deriva CSS del alto del PromoTrack. */
    itemAspectRatio?: "9/16" | "16/9";
    /** Fuerza a la matriz 2×2 a ser cuadrada (centrada) en vez de estirarse al ancho del tile. Útil en 16:9. */
    squareGrid?: boolean;
    /** Texto al pie del tile (ej. vigencia de la promoción). */
    nota?: string;
    /** Render por ítem opcional; si se omite se usa la celda por defecto (imagen + badge de descuento). */
    renderItem?: (item: T) => ReactNode;
    className?: string;
};

const formatOffDisc = (offDisc: string | number): string =>
    typeof offDisc === "number" ? `-${offDisc}%` : offDisc;

/**
 * Tile promocional estilo banner de categoría (título dentro de la tarjeta).
 * - Alto heredado del PromoTrack (contenedor de alto fijo); el ancho lo deriva
 *   CSS del aspecto exacto (9/16 o 16/9) → misma forma en cualquier viewport.
 * - Contenido en grid 2×2 (máx 4 items) con celdas object-cover (imágenes cuadradas estandarizadas).
 * - Fondo configurable: color sólido o imagen 16:9 con overlay suave para legibilidad.
 */
const PromoCarousel = <T extends PromoCarouselItem>({
    titulo,
    subtitulo,
    content,
    backgroundColor,
    backgroundImg,
    itemAspectRatio = "9/16",
    squareGrid,
    nota,
    renderItem,
    className,
}: Props<T>) => {
    const hasCustomBg = !!(backgroundImg || backgroundColor);

    const defaultRender = (item: T) => {
        const media = (
            <article className="relative w-full h-full rounded-xl overflow-hidden bg-base-100 group/media cursor-pointer flex items-center justify-center">
                <img
                    src={item.imageUrl}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="w-full h-auto max-h-full object-contain p-1 transition-transform duration-300 group-hover/media:scale-105"
                />
                {item.offDisc !== undefined && item.offDisc !== null && item.offDisc !== "" && (
                    <span className="absolute bottom-1.5 left-1.5 badge badge-error badge-sm font-bold text-white shadow-md">
                        {formatOffDisc(item.offDisc)}
                    </span>
                )}
            </article>
        );
        return item.href ? <Link to={item.href} className="block h-full">{media}</Link> : media;
    };

    return (
        <section
            className={clsx(
                "relative h-full shrink-0 overflow-hidden rounded-3xl flex flex-col p-4",
                hasCustomBg && "text-white",
                !backgroundImg && backgroundColor,
                className
            )}
            style={{ aspectRatio: itemAspectRatio }}
        >
            {/* Fondo decorativo (imagen 16:9) sin oscurecer; legibilidad por text-shadow */}
            {backgroundImg && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${backgroundImg}")` }}
                    aria-hidden
                />
            )}

            {/* Contenido sobre el fondo */}
            <div className={clsx(
                "relative flex flex-col h-full gap-3",
                backgroundImg && "[text-shadow:0_1px_4px_rgba(0,0,0,0.45)]"
            )}>
                <header className="min-w-0">
                    <h2 className={clsx(
                        "text-xl sm:text-2xl font-extrabold leading-tight",
                        hasCustomBg ? "text-white" : "text-base-content"
                    )}>
                        {titulo}
                    </h2>
                    {subtitulo && (
                        <p className={clsx(
                            "mt-1 text-xs sm:text-sm leading-snug line-clamp-2",
                            hasCustomBg ? "text-white/80" : "text-base-content/60"
                        )}>
                            {subtitulo}
                        </p>
                    )}
                </header>

                {/* Grid 2×2 de contenido (máx 4 items); cuadrado y centrado si squareGrid */}
                <div className={clsx(
                    "grid grid-cols-2 grid-rows-2 gap-2 min-h-0",
                    squareGrid ? "flex-1 aspect-square self-center" : "flex-1"
                )}>
                    {content.map((item) => (
                        <div key={item.id} className="min-h-0">
                            {renderItem ? renderItem(item) : defaultRender(item)}
                        </div>
                    ))}
                </div>

                {nota && (
                    <p className={clsx(
                        "text-[10px] leading-none",
                        hasCustomBg ? "text-white/70" : "text-base-content/50"
                    )}>
                        {nota}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PromoCarousel;
