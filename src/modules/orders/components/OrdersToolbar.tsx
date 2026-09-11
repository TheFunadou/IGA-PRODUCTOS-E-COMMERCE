import clsx from "clsx";
import { useDeferredValue, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaList, FaSearch, FaTh, FaTimesCircle } from "react-icons/fa";
import { formatOrderStatus } from "../../shopping/utils/ShoppingUtils";
import type { OrderStatusType } from "../../shopping/ShoppingTypes";
import {
    ORDER_DASHBOARD_SORT_FIELDS,
    type OrderDashboardView,
    type OrdersDashboardQueryState,
} from "../OrdersTypes";

type ActiveFilter = "folio" | "status" | "dateRange";

type Props = {
    state: OrdersDashboardQueryState;
    totalRecords: number | null;
    onPatch: (patch: Partial<OrdersDashboardQueryState>) => void;
    onReset: () => void;
};

const STATUS_OPTIONS: (OrderStatusType | "ALL")[] = [
    "ALL",
    "APPROVED",
    "AUTHORIZED",
    "IN_PROCESS",
    "PENDING",
    "IN_MEDIATION",
    "CANCELLATION_REQUESTED",
    "REJECTED",
    "CANCELLED",
    "CHARGED_BACK",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
    "ABANDONED",
];

const FILTER_OPTIONS: { value: ActiveFilter; label: string }[] = [
    { value: "folio", label: "Folio" },
    { value: "status", label: "Estatus" },
    { value: "dateRange", label: "Rango de fechas" },
];

const initialActiveFilter = (state: OrdersDashboardQueryState): ActiveFilter => {
    if (state.folio.trim()) return "folio";
    if (state.status !== "ALL") return "status";
    if (state.from || state.to) return "dateRange";
    return "folio";
};

const hasActiveFilters = (state: OrdersDashboardQueryState): boolean =>
    Boolean(state.folio || state.status !== "ALL" || state.from || state.to);

const OrdersToolbar = ({ state, totalRecords, onPatch, onReset }: Props) => {
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>(() => initialActiveFilter(state));
    const [folioInput, setFolioInput] = useState(state.folio);
    const deferredFolio = useDeferredValue(folioInput);

    useEffect(() => {
        setFolioInput(state.folio);
    }, [state.folio]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            if (deferredFolio !== state.folio) {
                onPatch({ folio: deferredFolio.trim() });
            }
        }, 450);
        return () => window.clearTimeout(timeout);
    }, [deferredFolio, state.folio, onPatch]);

    const viewButton = (view: OrderDashboardView, label: string, Icon: React.ElementType) => (
        <button
            onClick={() => onPatch({ view })}
            className={clsx(
                "btn btn-xs gap-1 font-bold border-0",
                state.view === view ? "btn-primary text-white shadow-sm" : "btn-ghost text-base-content/60"
            )}
            aria-pressed={state.view === view}
            aria-label={`Vista ${label}`}
        >
            <Icon />
            {label}
        </button>
    );

    return (
        <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm">
            <div className="card-body p-4 gap-3">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest shrink-0">
                            Buscar por
                        </span>
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
                            className="select select-bordered select-sm font-bold"
                            aria-label="Tipo de filtro"
                        >
                            {FILTER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                        {activeFilter === "folio" && (
                            <div className="relative flex-1 min-w-0">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30">
                                    <FaSearch className="text-sm" />
                                </span>
                                <input
                                    type="text"
                                    value={folioInput}
                                    onChange={(e) => setFolioInput(e.target.value)}
                                    placeholder="Buscar por folio..."
                                    className="input input-bordered input-sm w-full pl-9 font-semibold"
                                    aria-label="Buscar por folio"
                                />
                            </div>
                        )}

                        {activeFilter === "status" && (
                            <select
                                value={state.status}
                                onChange={(e) => onPatch({ status: e.target.value as OrderStatusType | "ALL" })}
                                className="select select-bordered select-sm font-bold flex-1 min-w-0"
                                aria-label="Filtrar por estatus"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status === "ALL" ? "Todos los estatus" : formatOrderStatus[status]}
                                    </option>
                                ))}
                            </select>
                        )}

                        {activeFilter === "dateRange" && (
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <label className="text-[10px] font-black uppercase text-base-content/40 shrink-0" htmlFor="orders-from">
                                    Del
                                </label>
                                <input
                                    id="orders-from"
                                    type="date"
                                    value={state.from}
                                    onChange={(e) => onPatch({ from: e.target.value })}
                                    className="input input-bordered input-sm font-semibold flex-1 min-w-0"
                                />
                                <label className="text-[10px] font-black uppercase text-base-content/40 shrink-0" htmlFor="orders-to">
                                    Al
                                </label>
                                <input
                                    id="orders-to"
                                    type="date"
                                    value={state.to}
                                    onChange={(e) => onPatch({ to: e.target.value })}
                                    className="input input-bordered input-sm font-semibold flex-1 min-w-0"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-1 bg-base-200 p-1 rounded-xl border border-base-300 shrink-0" role="group" aria-label="Vista de órdenes">
                            {viewButton("list", "Lista", FaList)}
                            {viewButton("grid", "Grid", FaTh)}
                        </div>
                    </div>
                </div>

                <div className="divider my-0 before:bg-base-300 after:bg-base-300" />

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-base-200 p-1 rounded-xl border border-base-300">
                        <span className="text-[10px] font-black uppercase text-base-content/40 ml-1.5 tracking-widest shrink-0">
                            Ordenar
                        </span>
                        <select
                            value={state.sortField}
                            onChange={(e) => onPatch({ sortField: e.target.value as OrdersDashboardQueryState["sortField"] })}
                            className="select select-ghost select-xs font-bold uppercase text-[10px] border-0 bg-transparent"
                            aria-label="Ordenar por"
                        >
                            {ORDER_DASHBOARD_SORT_FIELDS.map((field) => (
                                <option key={field.value} value={field.value}>
                                    {field.label}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => onPatch({ sortDir: state.sortDir === "asc" ? "desc" : "asc" })}
                            className="btn btn-ghost btn-xs px-2 font-black text-primary"
                            aria-label={`Cambiar dirección de orden (actualmente ${state.sortDir === "asc" ? "ascendente" : "descendente"})`}
                            title={state.sortDir === "asc" ? "Ascendente" : "Descendente"}
                        >
                            {state.sortDir === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasActiveFilters(state) && (
                            <button
                                onClick={onReset}
                                className="btn btn-ghost btn-xs gap-1.5 font-bold text-error"
                            >
                                <FaTimesCircle className="text-[11px]" />
                                Limpiar filtros
                            </button>
                        )}
                        {typeof totalRecords === "number" && (
                            <span className="text-[11px] font-bold text-base-content/40 uppercase tracking-widest">
                                {totalRecords} {totalRecords === 1 ? "orden" : "órdenes"}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersToolbar;