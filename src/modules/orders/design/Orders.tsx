import { startTransition, useEffect, useMemo, useState } from "react";
import { FaBox, FaShoppingBag, FaSignInAlt, FaRedoAlt } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { formatAxiosError } from "../../../api/helpers";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { useAuthStore } from "../../auth/states/authStore";
import { useCustomerOrdersDashboard } from "../hooks/useFetchOrders";
import type { OrderStatusType } from "../../shopping/ShoppingTypes";
import {
    ORDER_DASHBOARD_SORT_FIELDS,
    ORDERS_DASHBOARD_DEFAULT_STATE,
    type CustomerOrdersDashboardInputI,
    type CustomerOrdersDashboardFilterI,
    type CustomerOrdersDashboardSortI,
    type OrderDashboardSortField,
    type OrderDashboardView,
    type OrdersDashboardQueryState,
} from "../OrdersTypes";
import OrdersToolbar from "../components/OrdersToolbar";
import OrdersSidebar from "../components/OrdersSidebar";
import OrderDashboardCard from "../components/OrderDashboardCard";
import OrderGridCard from "../components/OrderGridCard";
import OrdersDashboardSkeleton from "../components/OrdersDashboardSkeleton";

const MAX_LIMIT_ROWS = 10;

const parseState = (params: URLSearchParams): OrdersDashboardQueryState => {
    const sortField = params.get("sortField") as OrderDashboardSortField | null;
    return {
        page: Number(params.get("page")) || 1,
        view: (params.get("view") as OrderDashboardView) ?? "list",
        sortField: ORDER_DASHBOARD_SORT_FIELDS.some((f) => f.value === sortField)
            ? (sortField as OrderDashboardSortField)
            : "purchaseDate",
        sortDir: params.get("sortDir") === "asc" ? "asc" : "desc",
        folio: params.get("folio") ?? "",
        status: (params.get("status") as OrderStatusType | "ALL") ?? "ALL",
        from: params.get("from") ?? "",
        to: params.get("to") ?? "",
    };
};

const buildFilters = ({ folio, status, from, to }: OrdersDashboardQueryState): CustomerOrdersDashboardFilterI | undefined => {
    const filters: CustomerOrdersDashboardFilterI = {};
    if (folio.trim()) filters.folio = folio.trim();
    if (status !== "ALL") filters.status = status;
    if (from && to) filters.dateRange = { gte: from, lte: to };
    return Object.keys(filters).length > 0 ? filters : undefined;
};

const buildSort = ({ sortField, sortDir }: OrdersDashboardQueryState): CustomerOrdersDashboardSortI | undefined => ({
    [sortField]: sortDir,
});

const serializeState = (state: OrdersDashboardQueryState): URLSearchParams => {
    const params = new URLSearchParams();
    if (state.page > 1) params.set("page", String(state.page));
    if (state.view !== "list") params.set("view", state.view);
    if (state.sortField !== "purchaseDate") params.set("sortField", state.sortField);
    if (state.sortDir !== "desc") params.set("sortDir", state.sortDir);
    if (state.folio.trim()) params.set("folio", state.folio.trim());
    if (state.status !== "ALL") params.set("status", state.status);
    if (state.from) params.set("from", state.from);
    if (state.to) params.set("to", state.to);
    return params;
};

const Orders = () => {
    const { authCustomer } = useAuthStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [initialState] = useState<OrdersDashboardQueryState>(() => parseState(searchParams));
    const [state, setState] = useState<OrdersDashboardQueryState>(initialState);
    const [activeOrderUuid, setActiveOrderUuid] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Iga Productos | Mis órdenes";
    }, []);

    useEffect(() => {
        setActiveOrderUuid(null);
    }, [state.page, state.view, state.sortField, state.sortDir, state.folio, state.status, state.from, state.to]);

    const updateState = (patch: Partial<OrdersDashboardQueryState>) => {
        startTransition(() => {
            const next = { ...state, ...patch, page: "page" in patch && patch.page !== undefined ? patch.page : patch.folio !== undefined || patch.status !== undefined || patch.from !== undefined || patch.to !== undefined || patch.sortField !== undefined || patch.sortDir !== undefined ? 1 : state.page };
            setState(next);
            setSearchParams(serializeState(next));
        });
    };

    const resetFilters = () => {
        startTransition(() => {
            const next = { ...ORDERS_DASHBOARD_DEFAULT_STATE, view: state.view };
            setState(next);
            setSearchParams(serializeState(next));
        });
    };

    const handlePageChange = (page: number) => updateState({ page });

    const dto = useMemo<CustomerOrdersDashboardInputI>(() => ({
        pagination: { page: state.page, limit: MAX_LIMIT_ROWS },
        filters: buildFilters(state),
        sort: buildSort(state),
    }), [state]);

    const { data, isLoading, error, refetch, isFetching } = useCustomerOrdersDashboard(dto);

    const handleToggleActive = (uuid: string) => {
        setActiveOrderUuid((current) => (current === uuid ? null : uuid));
    };

    const renderCards = () => {
        if (!data || data.data.length === 0) return null;
        if (state.view === "grid") {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.data.map((order) => (
                        <OrderGridCard
                            key={order.uuid}
                            order={order}
                            isActive={activeOrderUuid === order.uuid}
                            onToggleActive={() => handleToggleActive(order.uuid)}
                        />
                    ))}
                </div>
            );
        }
        return (
            <div className="flex flex-col gap-5">
                {data.data.map((order) => (
                    <OrderDashboardCard
                        key={order.uuid}
                        order={order}
                        isActive={activeOrderUuid === order.uuid}
                        onToggleActive={() => handleToggleActive(order.uuid)}
                    />
                ))}
            </div>
        );
    };

    const showSkeleton = isLoading && !data;
    const showError = !isLoading && !data && !!error;
    const showEmpty = !isLoading && !error && !!data && data.data.length === 0;
    const showContent = !isLoading && !error && !!data && data.data.length > 0;

    return (
        <div className="w-full flex justify-center items-center px-2 sm:px-3 md:px-4 py-6 md:py-10">
            <div className="w-full md:w-80/100 flex flex-col gap-5">
                <div className="flex w-full items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm">
                        <FaBox className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Mis órdenes
                        </h1>
                        <p className="text-sm sm:text-base text-base-content/60 mt-1.5 font-medium">
                            Revisa y gestiona el historial de tus compras
                        </p>
                    </div>
                </div>

                {!authCustomer ? (
                    <div className="w-full rounded-3xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
                        <div className="flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-base-200 flex items-center justify-center border border-base-300/50 shadow-inner">
                                <FaSignInAlt className="text-4xl text-base-content/20" />
                            </div>
                            <div className="max-w-sm">
                                <p className="text-xl font-bold text-base-content">Inicia sesión para ver tus órdenes</p>
                                <p className="text-sm text-base-content/50 mt-2 leading-relaxed">
                                    Necesitas una cuenta para consultar el historial de tus compras.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Link to="/iniciar-sesion" className="btn btn-primary btn-md gap-3 font-bold px-8 shadow-md">
                                    <FaSignInAlt className="text-lg" />
                                    Iniciar sesión
                                </Link>
                                <Link to="/tienda" className="btn btn-outline btn-md gap-3 font-bold px-6">
                                    <FaShoppingBag className="text-lg" />
                                    Ir a la tienda
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col lg:flex-row gap-5">
                        <div className="flex-1 min-w-0 flex flex-col gap-5">
                            <OrdersToolbar
                                state={state}
                                totalRecords={data?.totalRecords ?? null}
                                onPatch={updateState}
                                onReset={resetFilters}
                            />

                            {isFetching && data && (
                                <div className="flex justify-center">
                                    <span className="loading loading-spinner loading-sm text-primary" />
                                </div>
                            )}

                            {showSkeleton && <OrdersDashboardSkeleton view={state.view} />}

                            {showError && (
                                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-lg">
                                    <div className="px-4 py-3 bg-error/5 border-b border-error/10 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                                            <FaBox className="text-error text-lg" />
                                        </div>
                                        <h2 className="font-bold text-error text-sm uppercase">
                                            Error al cargar tus pedidos
                                        </h2>
                                    </div>
                                    <div className="p-8 flex flex-col items-center gap-4">
                                        <p className="text-sm text-base-content/70 max-w-md text-center">
                                            {formatAxiosError(error)}
                                        </p>
                                        <button
                                            className="btn btn-primary btn-sm px-6 gap-2 font-bold"
                                            onClick={() => refetch()}
                                        >
                                            <FaRedoAlt className="text-xs" />
                                            Intentar de nuevo
                                        </button>
                                    </div>
                                </div>
                            )}

                            {showEmpty && (
                                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
                                    <div className="flex flex-col items-center justify-center gap-6 py-24 px-6 text-center">
                                        <div className="w-20 h-20 rounded-3xl bg-base-200 flex items-center justify-center border border-base-300/50 shadow-inner">
                                            <FaBox className="text-4xl text-base-content/20" />
                                        </div>
                                        <div className="max-w-xs">
                                            <p className="text-xl font-bold text-base-content">
                                                {data && (data.totalRecords === 0 ? "Aún no tienes órdenes" : "Sin resultados")}
                                            </p>
                                            <p className="text-sm text-base-content/50 mt-2 leading-relaxed">
                                                {data && data.totalRecords === 0
                                                    ? "Parece que todavía no has realizado ninguna compra en nuestra tienda."
                                                    : "Ajusta tus filtros o realiza una nueva búsqueda."}
                                            </p>
                                        </div>
                                        <Link to="/tienda" className="btn btn-primary btn-md gap-3 font-bold px-8 shadow-md">
                                            <FaShoppingBag className="text-lg" />
                                            Comenzar a comprar
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {showContent && (
                                <div className="flex flex-col gap-5">
                                    {renderCards()}
                                    {data!.totalPages > 1 && (
                                        <div className="flex flex-col items-center sm:items-start gap-4 mt-2 py-6 border-t border-base-300">
                                            <PaginationComponent
                                                currentPage={state.page}
                                                onPageChange={handlePageChange}
                                                totalPages={data!.totalPages}
                                            />
                                            <p className="text-xs font-bold text-base-content/40 uppercase">
                                                Página <span className="text-base-content">{state.page}</span> de <span className="text-base-content">{data!.totalPages}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="w-full lg:w-80 xl:w-96 shrink-0">
                            <OrdersSidebar pageOrders={data?.data ?? []} totalRecords={data?.totalRecords ?? null} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;