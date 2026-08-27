import { useRef } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaUserAlt, FaUserPlus, FaGift, FaStar, FaShoppingBag, FaSave } from "react-icons/fa";
import { MdCheckBox } from "react-icons/md";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import { closeModal, showModal } from "../../../global/GlobalHelpers";
import AddressesModal from "./AddressesModal";
import GuestCheckoutFormV3 from "./GuestCheckoutFormV3";
import type { CustomerAddressType, GuestCreateOrderFormType } from "../../customers/CustomerTypes";

interface AddressSectionProps {
    isAuth: boolean;
    selectedAddress: CustomerAddressType | null;
    onSetSelectedAddress: (selected: CustomerAddressType) => void;
    showGuestForm: boolean;
    setShowGuestForm: (show: boolean) => void;
    showGuestFormEdit: boolean;
    setShowGuestFormEdit: (show: boolean) => void;
    guestAddressForm: GuestCreateOrderFormType | null;
    handleGuestFormSave: (data: GuestCreateOrderFormType) => void;
}

const AddressSection = ({
    isAuth,
    selectedAddress,
    onSetSelectedAddress,
    showGuestForm,
    setShowGuestForm,
    showGuestFormEdit,
    setShowGuestFormEdit,
    guestAddressForm,
    handleGuestFormSave,
}: AddressSectionProps) => {
    const addressesModal = useRef<HTMLDialogElement>(null);
    const { data: addresses, isLoading: addressesLoading, error: addressesError, refetch: addressesRefetch } =
        useFetchCustomerAddresses({ pagination: { page: 1, limit: 10 } });

    if (isAuth) {
        return (
            <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                    <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        Dirección de envío
                    </h2>
                </div>
                <div className="p-4 sm:p-5">
                    {addressesLoading && !addresses && !addressesError && (
                        <div className="flex items-center gap-3 py-4">
                            <span className="loading loading-spinner loading-sm text-primary" />
                            <span className="text-sm text-base-content/60">Cargando direcciones...</span>
                        </div>
                    )}
                    {!addressesLoading && !addressesError && selectedAddress && (
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="flex-1">
                                <p className="text-base sm:text-lg font-extrabold text-base-content">
                                    {selectedAddress.recipientName} {selectedAddress.recipientLastName}
                                    <span className="ml-2 badge badge-sm badge-primary badge-outline">{selectedAddress.addressType}</span>
                                </p>
                                <p className="text-sm text-base-content/70 mt-1">
                                    {selectedAddress.countryPhoneCode} {selectedAddress.contactNumber}
                                </p>
                                <p className="text-sm text-base-content/60 mt-0.5 leading-relaxed">
                                    {`${selectedAddress.streetName} #${selectedAddress.number}${selectedAddress.aditionalNumber !== "N/A" && selectedAddress.aditionalNumber !== "" ? ` Int. ${selectedAddress.aditionalNumber}` : ""}, ${selectedAddress.neighborhood}, ${selectedAddress.zipCode}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`}
                                </p>
                                {selectedAddress.defaultAddress && (
                                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-bold">
                                        <MdCheckBox /> Dirección predeterminada
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm border border-base-300 hover:bg-base-200 text-xs flex-shrink-0 gap-1.5"
                                onClick={() => showModal(addressesModal.current)}
                            >
                                <FaMapMarkerAlt className="text-primary text-xs" />
                                Cambiar dirección
                            </button>
                        </div>
                    )}
                    {!addressesLoading && !addresses && addressesError && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-base-content/70">Error al cargar las direcciones de envío</p>
                            <button type="button" className="btn btn-primary btn-sm w-fit" onClick={() => addressesRefetch()}>
                                Reintentar
                            </button>
                        </div>
                    )}
                    {!addressesLoading && addresses && addresses.data.length === 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-semibold text-base-content">No tienes direcciones de envío registradas</p>
                            <Link to="/mi-cuenta/direcciones-de-envio" className="text-primary text-sm underline underline-offset-2 hover:opacity-70 transition-opacity">
                                Crea una nueva dirección ahora
                            </Link>
                        </div>
                    )}
                </div>

                {addresses && selectedAddress && (
                    <AddressesModal
                        ref={addressesModal}
                        addresses={addresses.data}
                        onSetSelected={onSetSelectedAddress}
                        selectedAddress={selectedAddress}
                        onClose={() => closeModal(addressesModal.current)}
                    />
                )}
            </div>
        );
    }

    if (!showGuestForm) {
        return (
            <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                    <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        Dirección de envío
                    </h2>
                </div>
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FaUserPlus className="text-primary text-lg" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-base-content text-sm sm:text-base">¿Ya tienes cuenta? Inicia sesión</p>
                            <p className="text-xs text-base-content/50 mt-0.5">Accede a tus direcciones guardadas y completa tu compra más rápido</p>
                        </div>
                        <Link to="/iniciar-sesion" className="btn btn-primary btn-sm flex-shrink-0 w-full sm:w-auto">
                            Iniciar sesión
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-base-300" />
                        <span className="text-xs text-base-content/40 font-medium">o</span>
                        <div className="flex-1 h-px bg-base-300" />
                    </div>
                    <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                        <div className="flex items-start gap-3">
                            <FaGift className="text-warning text-lg flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-base-content mb-1.5">
                                    ¡No te pierdas estos beneficios al registrarte!
                                </p>
                                <ul className="flex flex-col gap-1.5">
                                    {[
                                        { icon: <FaSave className="text-warning text-xs" />, text: "Guarda el historial de tus compras" },
                                        { icon: <FaStar className="text-warning text-xs" />, text: "Recibe atención personalizada" },
                                        { icon: <FaShoppingBag className="text-primary text-xs" />, text: "Agiliza futuros pedidos" },
                                        { icon: <MdCheckBox className="text-info text-xs" />, text: "Se elegible para promociones especiales" },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
                                            <span className="text-xs text-base-content/70">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowGuestForm(true)}
                        className="btn btn-ghost btn-sm border border-base-300 hover:bg-base-200 gap-2 text-base-content/60 w-full"
                    >
                        <FaUserAlt className="text-xs" />
                        Continuar como invitado y rellenar formulario de envio
                    </button>
                </div>
            </div>
        );
    }

    if (guestAddressForm && !showGuestFormEdit) {
        return (
            <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        Dirección de envío (Invitado)
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowGuestFormEdit(true)}
                        className="text-xs text-base-content/50 hover:text-primary transition-colors underline underline-offset-2"
                    >
                        Editar
                    </button>
                </div>
                <div className="p-4 sm:p-5 flex flex-col gap-2">
                    <p className="text-base font-extrabold text-base-content">
                        {guestAddressForm.firstName} {guestAddressForm.lastName}
                    </p>
                    <p className="text-sm text-base-content/70">{guestAddressForm.email}</p>
                    <p className="text-sm text-base-content/60 leading-relaxed">
                        {`${guestAddressForm.streetName} #${guestAddressForm.number}${guestAddressForm.aditionalNumber ? ` Int. ${guestAddressForm.aditionalNumber}` : ""}, ${guestAddressForm.neighborhood}, ${guestAddressForm.locality}, ${guestAddressForm.city}, ${guestAddressForm.state}, ${guestAddressForm.country}`}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-success font-bold mt-1">
                        <MdCheckBox /> Dirección guardada correctamente
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
            <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
                <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                    <FaUserAlt className="text-primary text-xs" />
                    Datos de envío (Invitado)
                </h2>
                <button
                    type="button"
                    onClick={() => {
                        if (guestAddressForm) {
                            setShowGuestFormEdit(false);
                        } else {
                            setShowGuestForm(false);
                        }
                    }}
                    className="text-xs text-base-content/50 hover:text-primary transition-colors underline underline-offset-2"
                >
                    Volver
                </button>
            </div>
            <div className="p-4 sm:p-5">
                <GuestCheckoutFormV3 onSave={handleGuestFormSave} guestAddress={guestAddressForm} />
            </div>
        </div>
    );
};

export default AddressSection;
