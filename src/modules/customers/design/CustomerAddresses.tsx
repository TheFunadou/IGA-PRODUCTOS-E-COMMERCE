import { FaRegEdit, FaRegTrashAlt, FaMapMarkerAlt, FaPlus, FaStar } from "react-icons/fa";
import clsx from "clsx";
import { useRef, useState } from "react";
import NewAddressForm from "../components/NewAddressForm";
import { closeModal, showModal } from "../../../global/GlobalHelpers";
import { useFetchCustomerAddresses } from "../hooks/useCustomer";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { useAuthStore } from "../../auth/states/authStore";
import DeleteAddressForm from "../components/DeleteAddressForm";
import type { CustomerAddressType } from "../CustomerTypes";
import UpdateAddresssForm from "../components/UpdateAddressForm";
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../../../global/components/PaginationComponent";

const CustomerAddresses = () => {
    document.title = "Iga Productos | Mis direcciones de envio";

    const MAX_LIMIT_ROWS = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const { authCustomer } = useAuthStore();
    const newAddressModal = useRef<HTMLDialogElement>(null);
    const deleteAddressModal = useRef<HTMLDialogElement>(null);
    const updateAddressModal = useRef<HTMLDialogElement>(null);
    const [selected, setSelected] = useState<CustomerAddressType | null>(null);

    const { data: addresses, isLoading, error, refetch } = useFetchCustomerAddresses({
        pagination: { page: Number(pageParam) || 1, limit: MAX_LIMIT_ROWS },
    });

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200 min-h-screen">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Mis direcciones
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Gestiona tus direcciones de envío
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="btn btn-primary btn-sm gap-2 w-full sm:w-auto"
                    onClick={() => showModal(newAddressModal.current)}
                >
                    <FaPlus className="text-xs" />
                    Nueva dirección
                </button>
            </div>

            {/* ── Loading ── */}
            {isLoading && !error && !addresses && (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-full h-28 bg-base-100 border border-base-300 rounded-2xl animate-pulse" />
                    ))}
                </div>
            )}

            {/* ── Error ── */}
            {!isLoading && !addresses && error && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                            <FaMapMarkerAlt className="text-error text-sm" />
                        </div>
                        <h2 className="font-bold text-base-content text-sm uppercase">
                            Error al cargar direcciones
                        </h2>
                    </div>
                    <div className="p-5 space-y-3">
                        <p className="text-sm text-base-content/70">{getErrorMessage(error)}</p>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm gap-2"
                            onClick={() => refetch()}
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && !error && addresses && addresses.data.length === 0 && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                            <FaMapMarkerAlt className="text-3xl text-base-content/20" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-base-content">
                                No tienes direcciones registradas
                            </p>
                            <p className="text-sm text-base-content/50 mt-1">
                                Agrega tu primera dirección de envío para poder realizar compras
                            </p>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm gap-2 mt-1"
                            onClick={() => showModal(newAddressModal.current)}
                        >
                            <FaPlus className="text-xs" />
                            Agregar dirección
                        </button>
                    </div>
                </div>
            )}

            {/* ── Lista de direcciones ── */}
            {!isLoading && !error && addresses && addresses.data.length > 0 && (
                <div className="flex flex-col gap-4">
                    {addresses.data.map((data, index) => {
                        const isSelected = selected === data;

                        return (
                            <div
                                role="button"
                                key={index}
                                onClick={() => setSelected(data)}
                                className={clsx(
                                    "w-full rounded-2xl border bg-base-100 overflow-hidden cursor-pointer transition-all duration-200",
                                    isSelected
                                        ? "border-primary shadow-sm shadow-primary/10"
                                        : "border-base-300 hover:border-primary/30",
                                )}
                            >
                                {/* Card header */}
                                <div className={clsx(
                                    "px-4 py-3 border-b flex items-center justify-between gap-2 transition-colors duration-200",
                                    isSelected
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-base-200 border-base-300",
                                )}>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={clsx(
                                            "text-sm font-bold truncate",
                                            isSelected ? "text-primary" : "text-base-content",
                                        )}>
                                            {data.recipientName} {data.recipientLastName}
                                        </span>
                                        {data.defaultAddress && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary flex-shrink-0">
                                                <FaStar className="text-[9px]" />
                                                Predeterminada
                                            </span>
                                        )}
                                    </div>

                                    {/* Acciones — solo visibles cuando está seleccionada */}
                                    {isSelected && (
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-xs gap-1 text-primary hover:bg-primary/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showModal(updateAddressModal.current);
                                                }}
                                            >
                                                <FaRegEdit className="text-xs" />
                                                <span className="hidden sm:inline">Editar</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-xs gap-1 text-error hover:bg-error/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showModal(deleteAddressModal.current);
                                                }}
                                            >
                                                <FaRegTrashAlt className="text-xs" />
                                                <span className="hidden sm:inline">Eliminar</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Card body */}
                                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">Contacto</p>
                                        <p className="text-sm text-base-content">
                                            {data.countryPhoneCode} {data.contactNumber}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">Calle y número</p>
                                        <p className="text-sm text-base-content break-words">
                                            {data.streetName} #{data.number}
                                            {data.aditionalNumber && data.aditionalNumber !== "N/A"
                                                ? ` int. ${data.aditionalNumber}`
                                                : ""}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">Colonia / Fracc.</p>
                                        <p className="text-sm text-base-content break-words">{data.neighborhood}</p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">Ciudad y Estado</p>
                                        <p className="text-sm text-base-content">{data.city}, {data.state}</p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">País · CP</p>
                                        <p className="text-sm text-base-content">{data.country} · {data.zipCode}</p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">Tipo de dirección</p>
                                        <p className="text-sm text-base-content">{data.addressType}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Paginación */}
                    {addresses.totalPages > 1 && (
                        <div className="flex flex-col items-center sm:items-start gap-2 mt-2">
                            <PaginationComponent
                                currentPage={Number(pageParam) || 1}
                                onPageChange={handlePageChange}
                                totalPages={addresses.totalPages}
                            />
                            <p className="text-sm text-base-content/50">
                                Página {Number(pageParam) || 1} de {addresses.totalPages}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Modales ── */}
            {newAddressModal && (
                <NewAddressForm
                    ref={newAddressModal}
                    onCreated={() => closeModal(newAddressModal.current)}
                />
            )}
            {deleteAddressModal && (
                <DeleteAddressForm
                    ref={deleteAddressModal}
                    address={selected?.uuid!}
                    customer={authCustomer?.uuid}
                    onDeleted={() => closeModal(deleteAddressModal.current)}
                />
            )}
            {updateAddressModal && (
                <UpdateAddresssForm
                    ref={updateAddressModal}
                    address={selected?.uuid!}
                    versionData={selected}
                    customer={authCustomer?.uuid}
                    onUpdated={() => closeModal(updateAddressModal.current)}
                />
            )}
        </div>
    );
};

export default CustomerAddresses;