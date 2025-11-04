import { useEffect, useState, type RefObject } from "react";
import type { CustomerAddressType } from "../../customers/CustomerTypes";
import clsx from "clsx";
import { Link } from "react-router-dom";

type Props = {
    addresses: CustomerAddressType[];
    ref: RefObject<HTMLDialogElement | null>;
    onSetSelected: (address: CustomerAddressType) => void;
    selectedAddress: CustomerAddressType;
    onClose: () => void;
};

const AddressesModal = ({ addresses, ref, selectedAddress, onClose, onSetSelected }: Props) => {
    const [selected, setSelected] = useState<CustomerAddressType | null>(null);

    useEffect(() => {
        setSelected(selectedAddress)
    }, [addresses]);

    const handleClose = () => {
        if (!selected) return;
        onSetSelected(selected);
        onClose();
    };

    return (
        <dialog id="my_modal_3" className="modal" ref={ref}>
            <div className="modal-box max-w-3xl">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-2xl">Seleccionar dirección de envio</h3>
                <div className="flex gap-2">
                    <Link to={"/mi-cuenta/direcciones-de-envio"} className="underline text-primary">Agregar nueva dirección de envio</Link>
                </div>
                <div className="h-120 overflow-y-scroll bg-base-200 p-5 mt-5 flex flex-col gap-3 rounded-xl">
                    {addresses && addresses.map((data, index) => (
                        <div
                            className={clsx(
                                "w-full rounded-xl p-4",
                                selected === data && "border-2 border-primary bg-base-100 scale-101 duration-200"
                            )}
                            onClick={() => setSelected(data)}
                            key={index}>
                            <p className="text-xl font-bold">{`${data.recipient_name} ${data.recipient_last_name}`}</p>
                            <p>{data.country_phone_code} {data.contact_number}</p>
                            <p>{`${data.street_name}, #${data.number} EXT.${data.aditional_number === "N/A" ? "" : `${data.aditional_number} INT.`} ${data.neighborhood}, ${data.zip_code}, ${data.city}, ${data.state}, ${data.country}`}</p>
                            {data.default_address === true && <p className="text-lg font-bold">Dirección predeterminada</p>}
                        </div>
                    ))}
                </div>
                <div className="w-full mt-5">
                    <button type="button" className="w-full btn btn-primary" onClick={handleClose}>Usar esta dirección de envio</button>
                </div>
            </div>
        </dialog>
    );
};

export default AddressesModal;