import { useEffect, useState, type RefObject } from "react";
import type { CustomerAddressType } from "../../customers/CustomerTypes";
import clsx from "clsx";
import { Link } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaHome,
    FaBriefcase,
    FaStar,
    FaCheck,
    FaPlus,
    FaPhone,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";

type Props = {
    addresses: CustomerAddressType[];
    ref: RefObject<HTMLDialogElement | null>;
    onSetSelected: (address: CustomerAddressType) => void;
    selectedAddress: CustomerAddressType;
    onClose: () => void;
};

/* ── Helpers ───────────────────────────────────────────────────── */

const ADDRESS_TYPE_ICONS: Record<string, React.ReactNode> = {
    Casa: <FaHome className="text-xs" />,
    Trabajo: <FaBriefcase className="text-xs" />,
    Departamento: <MdApartment className="text-sm" />,
};

const formatAddress = (data: CustomerAddressType): string => {
    const interior =
        data.aditional_number && data.aditional_number !== "N/A"
            ? ` INT. ${data.aditional_number}`
            : "";
    return `${data.street_name} #${data.number}${interior}, ${data.neighborhood}, C.P. ${data.zip_code}, ${data.city}, ${data.state}, ${data.country}`;
};

/* ── Component ─────────────────────────────────────────────────── */

const AddressesModal = ({ addresses, ref, selectedAddress, onClose, onSetSelected }: Props) => {
    const [selected, setSelected] = useState<CustomerAddressType | null>(null);

    useEffect(() => {
        setSelected(selectedAddress);
    }, [addresses]);

    const handleClose = () => {
        if (!selected) return;
        onSetSelected(selected);
        onClose();
    };

    return (
        <dialog id="my_modal_3" className="modal" ref={ref}>
            <div className="modal-box w-full max-w-2xl h-auto max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-base-100 border border-base-300">

                {/* ── Modal Header ── */}
                <div className="sticky top-0 z-10 px-5 py-4 bg-base-200 border-b border-base-300 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FaMapMarkerAlt className="text-primary text-sm" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-base-content leading-none">
                                Seleccionar dirección de envío
                            </h3>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                Elige dónde quieres recibir tu pedido
                            </p>
                        </div>
                    </div>

                    {/* Close */}
                    <form method="dialog">
                        <button
                            className="btn btn-sm btn-circle btn-ghost text-base-content/40 hover:text-base-content"
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    </form>
                </div>

                {/* ── Content ── */}
                <div className="p-5 flex flex-col gap-4">

                    {/* Add new address link */}
                    <Link
                        to={"/mi-cuenta/direcciones-de-envio"}
                        className="flex items-center gap-2 w-fit text-xs font-medium text-primary hover:text-primary/70 transition-colors"
                    >
                        <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FaPlus className="text-[10px]" />
                        </span>
                        Agregar nueva dirección de envío
                    </Link>

                    {/* Addresses list */}
                    <div className="flex flex-col gap-3">
                        {addresses && addresses.map((data, index) => {
                            const isSelected = selected === data;
                            const typeIcon = ADDRESS_TYPE_ICONS[data.address_type] ?? <FaMapMarkerAlt className="text-xs" />;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelected(data)}
                                    className={clsx(
                                        "w-full text-left rounded-xl p-4 border transition-all duration-200",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                                        isSelected
                                            ? "border-primary/40 bg-primary/5 shadow-sm"
                                            : "border-base-300 bg-base-200 hover:border-primary/20 hover:bg-base-100"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">

                                        {/* Left: info */}
                                        <div className="flex items-start gap-3 min-w-0">

                                            {/* Address type icon */}
                                            <div className={clsx(
                                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                                                isSelected ? "bg-primary/15 text-primary" : "bg-base-300 text-base-content/50"
                                            )}>
                                                {typeIcon}
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0">
                                                {/* Name + type badge */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-bold text-sm text-base-content leading-tight">
                                                        {data.recipient_name} {data.recipient_last_name}
                                                    </p>
                                                    {data.address_type && (
                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-base-300 bg-base-100 text-base-content/50 leading-none">
                                                            {data.address_type}
                                                        </span>
                                                    )}
                                                    {data.default_address && (
                                                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 leading-none">
                                                            <FaStar className="text-[8px]" />
                                                            Predeterminada
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Phone */}
                                                <p className="flex items-center gap-1.5 text-xs text-base-content/50 mt-1.5">
                                                    <FaPhone className="text-[10px] flex-shrink-0" />
                                                    {data.country_phone_code} {data.contact_number}
                                                </p>

                                                {/* Address */}
                                                <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                                                    {formatAddress(data)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: check indicator */}
                                        <div className={clsx(
                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-200",
                                            isSelected
                                                ? "border-primary bg-primary text-white"
                                                : "border-base-300 bg-transparent"
                                        )}>
                                            {isSelected && <FaCheck className="text-[9px]" />}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {/* Empty state */}
                        {(!addresses || addresses.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-base-content/40">
                                <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center">
                                    <FaMapMarkerAlt className="text-xl" />
                                </div>
                                <p className="text-sm font-medium">No tienes direcciones guardadas</p>
                                <Link
                                    to={"/mi-cuenta/direcciones-de-envio"}
                                    className="text-xs text-primary font-medium hover:underline"
                                >
                                    Agregar una dirección
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-base-300" />

                    {/* CTA */}
                    <button
                        type="button"
                        disabled={!selected}
                        className="w-full btn btn-primary font-bold gap-2"
                        onClick={handleClose}
                    >
                        <FaMapMarkerAlt className="text-sm" />
                        Usar esta dirección de envío
                    </button>
                </div>
            </div>

            {/* Backdrop click closes modal */}
            <form method="dialog" className="modal-backdrop">
                <button aria-label="Cerrar modal" />
            </form>
        </dialog>
    );
};

export default AddressesModal;