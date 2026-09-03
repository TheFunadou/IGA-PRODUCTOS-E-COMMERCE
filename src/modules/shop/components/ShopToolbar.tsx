import { useCallback, useEffect, useRef, useState } from "react";
import { BiGridHorizontal, BiListUl } from "react-icons/bi";
import { FaFilter } from "react-icons/fa6";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Minus, Package, X } from "lucide-react";
import clsx from "clsx";
import type { PV3Sort, PV3SortField } from "../../products/ProductTypes";

export const SHOP_SORT_FIELDS: {
    field: PV3SortField;
    label: string;
    ascLabel: string;
    descLabel: string;
}[] = [
        { field: "unit_price", label: "Precio", ascLabel: "menor a mayor", descLabel: "mayor a menor" },
        { field: "product_name", label: "Nombre", ascLabel: "A-Z", descLabel: "Z-A" },
        { field: "created_at", label: "Creación", ascLabel: "antiguos primero", descLabel: "recientes primero" },
        { field: "updated_at", label: "Actualización", ascLabel: "antiguo primero", descLabel: "reciente primero" },
        { field: "category", label: "Categoría", ascLabel: "A-Z", descLabel: "Z-A" },
        { field: "sku", label: "SKU", ascLabel: "A-Z", descLabel: "Z-A" },
        { field: "stock", label: "Stock", ascLabel: "menor a mayor", descLabel: "mayor a menor" },
        { field: "color_name", label: "Color", ascLabel: "A-Z", descLabel: "Z-A" },
        { field: "status", label: "Status", ascLabel: "A-Z", descLabel: "Z-A" },
    ];

interface ShopToolbarProps {
    totalRecords: number;
    sorts: PV3Sort;
    onSortChange: (field: PV3SortField, dir: "asc" | "desc" | undefined) => void;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    onOpenMobileFilters: () => void;
}

const ShopToolbar = ({
    totalRecords,
    sorts,
    onSortChange,
    viewMode,
    onViewModeChange,
    onOpenMobileFilters,
}: ShopToolbarProps) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const activeFields = SHOP_SORT_FIELDS.filter((f) => sorts[f.field]);
    const currentSortLabel =
        activeFields.length === 0
            ? "Ordenar"
            : `${activeFields[0].label}: ${sorts[activeFields[0].field] === "asc" ? activeFields[0].ascLabel : activeFields[0].descLabel}` +
            (activeFields.length > 1 ? ` (+${activeFields.length - 1})` : "");

    const close = useCallback(() => setOpen(false), []);

    /* Cerrar el menú al hacer clic/tap fuera del dropdown */
    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (e: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                close();
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, close]);

    /* Ciclar dirección: desactivado → asc → desc → desactivado */
    const cycleSort = (field: PV3SortField) => {
        const current = sorts[field];
        if (!current) onSortChange(field, "asc");
        else if (current === "asc") onSortChange(field, "desc");
        else onSortChange(field, undefined);
    };

    const DirectionIcon = ({ field }: { field: PV3SortField }) => {
        const dir = sorts[field];
        if (!dir) return <ArrowUpDown size={14} className="text-base-content/30" />;
        return dir === "asc"
            ? <ArrowUp size={14} className="text-primary" />
            : <ArrowDown size={14} className="text-primary" />;
    };

    return (
        <div className="w-full flex flex-wrap items-center gap-2 sm:gap-3 bg-base-100 px-3 sm:px-4 py-3 rounded-2xl border border-base-300">
            {/* Filtros (mobile/tablet) */}
            <button
                type="button"
                className="lg:hidden btn btn-sm bg-blue-950 text-white hover:bg-blue-800 gap-2 text-sm font-bold border-none"
                onClick={onOpenMobileFilters}
            >
                <FaFilter className="text-xs" />
                Filtros
            </button>

            {/* Conteo de resultados */}
            <p className="text-sm text-base-content/60 font-medium flex items-center gap-1.5 min-w-0">
                <Package size={14} className="shrink-0 hidden sm:block" />
                <span className="truncate">
                    {totalRecords} producto{totalRecords !== 1 ? "s" : ""}
                </span>
            </p>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                {/* Ordenamiento */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        className={clsx(
                            "btn btn-outline btn-sm gap-1.5 rounded-xl border-base-300 normal-case",
                            open && "border-primary/60 text-primary bg-primary/5"
                        )}
                    >
                        <ArrowUpDown size={13} />
                        <span className="hidden sm:inline max-w-40 truncate">{currentSortLabel}</span>
                        <ChevronDown size={12} className={clsx("transition-transform", open && "rotate-180")} />
                    </button>

                    {open && (
                        <div
                            role="menu"
                            aria-label="Ordenar productos"
                            className="absolute right-0 z-30 p-2 shadow-lg bg-base-100 border border-base-300 rounded-xl w-72 max-h-[70vh] overflow-y-auto flex flex-col gap-0.5"
                        >
                            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-base-200 mb-1">
                                <span className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest">Ordenar por</span>
                                <button
                                    type="button"
                                    onClick={close}
                                    aria-label="Cerrar menú de orden"
                                    className="btn btn-ghost btn-xs btn-circle hover:bg-base-200"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {SHOP_SORT_FIELDS.map((f) => {
                                const dir = sorts[f.field];
                                return (
                                    <button
                                        key={f.field}
                                        type="button"
                                        role="menuitem"
                                        onClick={() => cycleSort(f.field)}
                                        aria-pressed={!!dir}
                                        className={clsx(
                                            "flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg transition-colors text-left",
                                            dir ? "bg-primary/10" : "hover:bg-base-200/70"
                                        )}
                                    >
                                        <span className={clsx("text-sm truncate flex items-center gap-2", dir ? "font-bold text-primary" : "text-base-content/80")}>
                                            {f.label}
                                            {dir && (
                                                <span className={clsx(
                                                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                                                    dir === "asc" ? "bg-primary/15 text-primary" : "bg-primary/15 text-primary"
                                                )}>
                                                    {dir === "asc" ? "↑ A-Z" : "↓ Z-A"}
                                                </span>
                                            )}
                                        </span>
                                        <span className="shrink-0">
                                            <DirectionIcon field={f.field} />
                                        </span>
                                    </button>
                                );
                            })}

                            {activeFields.length > 0 && (
                                <div className="border-t border-base-200 mt-1 pt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => SHOP_SORT_FIELDS.forEach((f) => onSortChange(f.field, undefined))}
                                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-error/80 hover:bg-error/10 flex items-center gap-1.5"
                                    >
                                        <Minus size={13} /> Quitar todos los ordenamientos
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Vista grid/lista */}
                <div className="flex items-center bg-base-200 border border-base-200 rounded-xl p-0.5 gap-0.5">
                    <button
                        type="button"
                        onClick={() => onViewModeChange("grid")}
                        aria-label="Vista cuadrícula"
                        title="Vista cuadrícula"
                        className={clsx(
                            "p-2 rounded-lg transition-colors duration-200",
                            viewMode === "grid"
                                ? "bg-blue-950 text-white shadow-sm"
                                : "text-base-content/50 hover:text-base-content"
                        )}
                    >
                        <BiGridHorizontal className="text-lg" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onViewModeChange("list")}
                        aria-label="Vista lista"
                        title="Vista lista"
                        className={clsx(
                            "p-2 rounded-lg transition-colors duration-200",
                            viewMode === "list"
                                ? "bg-blue-950 text-white shadow-sm"
                                : "text-base-content/50 hover:text-base-content"
                        )}
                    >
                        <BiListUl className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopToolbar;
