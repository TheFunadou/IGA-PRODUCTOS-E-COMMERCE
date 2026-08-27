import { BiGridHorizontal, BiListUl } from "react-icons/bi";
import { FaFilter } from "react-icons/fa6";
import { ArrowUpDown, ChevronDown, Package } from "lucide-react";
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
    const activeFields = SHOP_SORT_FIELDS.filter((f) => sorts[f.field]);
    const currentSortLabel =
        activeFields.length === 0
            ? "Ordenar"
            : `${activeFields[0].label}: ${sorts[activeFields[0].field] === "asc" ? activeFields[0].ascLabel : activeFields[0].descLabel}` +
            (activeFields.length > 1 ? ` (+${activeFields.length - 1})` : "");

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
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-outline btn-sm gap-1.5 rounded-xl border-base-300 hover:border-primary/50 hover:bg-primary/5 normal-case"
                    >
                        <ArrowUpDown size={13} />
                        <span className="hidden sm:inline max-w-40 truncate">{currentSortLabel}</span>
                        <ChevronDown size={12} />
                    </div>
                    <ul
                        tabIndex={-1}
                        className="dropdown-content z-30 p-2 shadow-lg bg-base-100 border border-base-300 rounded-xl w-72 max-h-[70vh] overflow-y-auto flex flex-col gap-0.5"
                    >
                        {SHOP_SORT_FIELDS.map((f) => {
                            const dir = sorts[f.field];
                            return (
                                <li
                                    key={f.field}
                                    className={clsx(
                                        "flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-lg transition-colors list-none",
                                        dir ? "bg-primary/10" : "hover:bg-base-200/70"
                                    )}
                                >
                                    <span className={clsx("text-sm truncate", dir ? "font-bold text-primary" : "text-base-content/80")}>
                                        {f.label}:
                                    </span>
                                    <select
                                        className="select select-xs select-bordered w-auto shrink-0 bg-base-100 font-medium text-base-content/80"
                                        value={dir ?? ""}
                                        onChange={(e) => onSortChange(f.field, (e.target.value || undefined) as "asc" | "desc" | undefined)}
                                        aria-label={`Dirección de orden por ${f.label}`}
                                    >
                                        <option value="">—</option>
                                        <option value="asc">{f.ascLabel}</option>
                                        <option value="desc">{f.descLabel}</option>
                                    </select>
                                </li>
                            );
                        })}
                    </ul>
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
