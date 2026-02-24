import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
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
    const {
        data: addresses,
        isLoading,
        error,
        refetch
    } = useFetchCustomerAddresses({
        pagination: {
            page: Number(pageParam) || 1,
            limit: MAX_LIMIT_ROWS
        }
    });

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    return (
        <div className="w-full px-3 sm:px-5 py-6 sm:py-10 rounded-xl min-h-screen bg-base-300">
            {/* Header Section */}
            <p className="text-2xl sm:text-3xl font-bold">Direcciones de envio</p>
            <div className="flex gap-2 mt-2">
                <button
                    type="button"
                    className="flex items-center gap-1 text-base sm:text-lg underline text-primary cursor-pointer"
                    onClick={() => showModal(newAddressModal.current)}>
                    <CiCirclePlus className="text-xl sm:text-2xl" />
                    <span className="hidden sm:inline">Agregar nueva dirección de envio</span>
                    <span className="sm:hidden">Nueva dirección</span>
                </button>
            </div>

            {/* Loading State */}
            {isLoading && !error && !addresses && (
                <div className="w-full [&_div]:mb-2 bg-base-100 px-3 sm:px-5 pt-5 py-5 mt-5 rounded-xl">
                    <div className="w-full skeleton h-20 sm:h-24 lg:py-15"></div>
                    <div className="w-full skeleton h-20 sm:h-24 lg:py-15"></div>
                    <div className="w-full skeleton h-20 sm:h-24 lg:py-15"></div>
                    <div className="w-full skeleton h-20 sm:h-24 lg:py-15"></div>
                </div>
            )}

            {/* Error State */}
            {!isLoading && !addresses && error && (
                <div className="w-full bg-base-100 p-4 sm:p-5 rounded-xl mt-5">
                    <p className="mt-2 text-lg sm:text-xl">Ocurrio un error inesperado al obtener las direcciones de envio.</p>
                    <p className="mt-1 text-base sm:text-lg text-error">{getErrorMessage(error)}</p>
                    <div className="mt-3">
                        <button
                            type="button"
                            className="btn btn-primary cursor-pointer btn-sm sm:btn-md"
                            onClick={() => refetch}
                        >
                            Reintentar?
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && addresses && addresses.data.length === 0 && (
                <div className="w-full sm:w-fit bg-base-100 p-4 sm:p-5 rounded-xl mt-2">
                    <h2 className="mt-2 text-lg sm:text-xl">Parece que aun no tienes direcciones de envio registradas por el momento 🤔</h2>
                    <button
                        type="button"
                        className="link text-primary text-base sm:text-lg mt-2"
                        onClick={() => showModal(newAddressModal.current)}
                    >
                        Crea una nueva dirección de envio ahora
                    </button>
                </div>
            )}

            {/* Addresses List - Responsive */}
            {!isLoading && !error && addresses && addresses.data.length > 0 && (
                <div className="w-full">
                    <h3 className="text-base sm:text-lg mt-3">Selecciona una dirección de envio</h3>
                    {addresses && addresses.data.map((data, index) => (
                        <div
                            role="button"
                            onClick={() => setSelected(data)}
                            key={index}
                            className={clsx(
                                "w-full flex flex-col lg:flex-row py-4 sm:py-5 px-3 sm:px-5 rounded-xl mt-3 cursor-pointer transition-all",
                                selected === data && "border-2 border-primary bg-base-100 scale-101 duration-200",
                                selected !== data && "hover:bg-base-100"
                            )}
                        >
                            {/* Address Info Section */}
                            <div className="w-full lg:w-85/100">
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                                    {`${data.recipient_name} ${data.recipient_last_name}`}
                                </p>
                                <p className="text-sm sm:text-base lg:text-lg mt-1">
                                    {data.country_phone_code} {data.contact_number}
                                </p>
                                <p className="text-sm sm:text-base lg:text-lg mt-1 break-words">
                                    {`${data.street_name}, #${data.number} ${data.aditional_number !== "N/A" ? `EXT.${data.aditional_number} INT.` : "EXT."} ${data.neighborhood}, ${data.zip_code}, ${data.city}, ${data.state}, ${data.country}`}
                                </p>
                                {data.default_address === true && (
                                    <p className="text-base sm:text-lg lg:text-xl font-bold text-primary mt-2">
                                        Dirección predeterminada
                                    </p>
                                )}
                            </div>

                            {/* Actions Section */}
                            <div className="w-full lg:w-15/100 text-left lg:text-right mt-3 lg:mt-0">
                                {selected === data && (
                                    <div className="flex flex-row lg:flex-col xl:flex-row justify-start lg:justify-end items-start gap-3 sm:gap-4 text-base sm:text-lg lg:text-xl mb-2 lg:mb-0">
                                        <button
                                            type="button"
                                            className="flex gap-1 sm:gap-2 items-center text-primary cursor-pointer hover:underline"
                                            onClick={() => showModal(updateAddressModal.current)}
                                        >
                                            <span className="hidden sm:inline">Editar</span>
                                            <span className="sm:hidden">Editar</span>
                                            <FaRegEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="flex gap-1 sm:gap-2 items-center text-error cursor-pointer hover:underline"
                                            onClick={() => showModal(deleteAddressModal.current)}
                                        >
                                            <span className="hidden sm:inline">Eliminar</span>
                                            <span className="sm:hidden">Eliminar</span>
                                            <FaRegTrashAlt />
                                        </button>
                                    </div>
                                )}
                                <p className="font-bold text-sm sm:text-base lg:text-xl text-primary lg:text-inherit">
                                    {data.address_type}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Pagination - Responsive */}
                    {addresses.totalPages > 1 && (
                        <div className="mt-5 w-full sm:w-fit">
                            <PaginationComponent
                                currentPage={Number(pageParam) || 1}
                                onPageChange={handlePageChange}
                                totalPages={addresses.totalPages}
                            />
                            <p className="text-center text-sm sm:text-base mt-2">
                                Página {Number(pageParam) || 1} de {addresses.totalPages}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
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