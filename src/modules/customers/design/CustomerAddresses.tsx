import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { TbAddressBookOff } from "react-icons/tb";
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
import { useThemeStore } from "../../../layouts/states/themeStore";

const CustomerAddresses = () => {
    const { theme } = useThemeStore();
    const { authCustomer } = useAuthStore();
    const newAddressModal = useRef<HTMLDialogElement>(null);
    const deleteAddressModal = useRef<HTMLDialogElement>(null);
    const updateAddressModal = useRef<HTMLDialogElement>(null);
    const [selected, setSelected] = useState<CustomerAddressType | null>(null);
    const {
        data,
        isLoading,
        error,
        refetch
    } = useFetchCustomerAddresses();
    return (
        <div className={clsx("w-full px-5 py-10 rounded-xl min-h-screen", theme === "ligth" && "bg-base-300", theme === "dark" && "bg-slate-900")}>
            <p className="text-3xl font-bold">Direcciones de envio</p>
            <div className="flex gap-2 mt-2">
                <button
                    type="button"
                    className="flex items-center gap-1 text-lg underline text-primary cursor-pointer"
                    onClick={() => showModal(newAddressModal.current)}>
                    <CiCirclePlus />Agregar nueva dirección de envio
                </button>
            </div>
            <p className="text-lg mt-3">Selecciona una dirección de envio</p>
            {isLoading ? (
                <div className="w-full [&_div]:mb-2 bg-white px-5 pt-5 py-5 mt-5 rounded-xl">
                    <div className="w-full skeleton py-15"></div>
                    <div className="w-full skeleton py-15"></div>
                    <div className="w-full skeleton py-15"></div>
                    <div className="w-full skeleton py-15"></div>
                </div>
            ) : (
                <div className={clsx("w-full px-5 pt-5 py-5 mt-5 rounded-xl", theme === "ligth" && "bg-white", theme === "dark" && "bg-slate-950")}>
                    {error ? (
                        <div className="w-full">
                            <p className="mt-2 text-xl">Ocurrio un error inesperado al obtener las direcciones de envio.</p>
                            <p className="mt-1 text-lg text-error">{getErrorMessage(error)}</p>
                            <div>
                                <button type="button" className="btn btn-primary cursor-pointer" onClick={() => refetch}>Reintentar?</button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            {data && data.length > 0 ? (
                                <div className="w-full">
                                    {data && data.map((data, index) => (
                                        <div role="button" onClick={() => setSelected(data)} key={index} className={clsx(
                                            "w-full flex py-5 px-5 rounded-xl",
                                            selected === data && "border-2 border-primary bg-base-100 scale-101 duration-200"
                                        )}>
                                            <div className="w-85/100">
                                                <p className="text-2xl font-bold">{`${data.recipient_name} ${data.recipient_last_name}`}</p>
                                                <p className="text-lg">{data.country_phone_code} {data.contact_number}</p>
                                                <p className="text-lg">{`${data.street_name}, #${data.number} EXT.${data.aditional_number === "N/A" ? "" : `${data.aditional_number} INT.`} ${data.neighborhood}, ${data.zip_code}, ${data.city}, ${data.state}, ${data.country}`}</p>
                                                {data.default_address === true && <p className="text-xl font-bold">Dirección predeterminada</p>}
                                            </div>
                                            <div className="w-15/100 text-right">
                                                {selected === data &&
                                                    <div className="  flex justify-end items-start text-xl gap-4">
                                                        <button type="button" className="flex gap-2 items-center text-primary cursor-pointer" onClick={() => showModal(updateAddressModal.current)}>Editar <FaRegEdit /></button>
                                                        <button type="button" className="flex gap-2 items-center text-error cursor-pointer" onClick={() => showModal(deleteAddressModal.current)}>Eliminar <FaRegTrashAlt /></button>
                                                    </div>
                                                }
                                                <p className="font-bold text-xl">{data.address_type}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full py-3">
                                    <p className="flex gap-2 items-center text-xl text-gray-500"><TbAddressBookOff className="text-3xl" />No tienes direcciones de envio aun...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {newAddressModal && <NewAddressForm ref={newAddressModal} customer={authCustomer?.uuid} onCreated={() => closeModal(newAddressModal.current)} />}
            {deleteAddressModal && <DeleteAddressForm ref={deleteAddressModal} address={selected?.uuid!} customer={authCustomer?.uuid} onDeleted={() => closeModal(deleteAddressModal.current)} />}
            {updateAddressModal && <UpdateAddresssForm ref={updateAddressModal} address={selected?.uuid!} versionData={selected} customer={authCustomer?.uuid} onUpdated={() => closeModal(updateAddressModal.current)} />}
        </div>
    );
};

export default CustomerAddresses;