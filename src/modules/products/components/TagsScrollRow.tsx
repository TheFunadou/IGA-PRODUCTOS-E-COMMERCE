import type { PV3TagData } from "../ProductTypes";

/* Fila de tags mobile con scroll horizontal y fade de "hay más" a la derecha.
   Patrón compartido: se usa en el detalle del producto (MobileTitleSection)
   y en la tarjeta mobile del carrito de compras.

   - Los tags son no interactivos (cursor-default).
   - El siguiente tag queda cortado a medio ver (peek) como señal de que hay más.
   - Fade degradado en el borde derecho, del color de fondo que se le pase
     (por defecto base-100, que es el fondo de ambas superficies).
   - Si no hay tags, no se renderiza nada. */
interface TagsScrollRowProps {
    tags: PV3TagData[];
    fadeFrom?: string;
}

const TagsScrollRow = ({ tags, fadeFrom = "from-base-100" }: TagsScrollRowProps) => {
    if (tags.length === 0) return null;
    return (
        <div className="relative">
            <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max pl-1 gap-1.5 py-0.5">
                    {tags.map(tag => (
                        <span
                            key={tag.id}
                            className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-xs text-xs font-semibold bg-base-200/60 text-base-content/70 border border-base-300 cursor-default"
                            title={`Tier ${tag.tier}`}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l ${fadeFrom} to-transparent`} />
        </div>
    );
};

export default TagsScrollRow;
