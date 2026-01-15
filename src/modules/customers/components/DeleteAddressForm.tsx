import type { RefObject } from "react";
import { useDeleteAddress } from "../hooks/useCustomer";

type Props = {
    address: string | undefined;
    customer: string | undefined;
    ref: RefObject<HTMLDialogElement | null>;
    onDeleted: () => void;
};

const DeleteAddressForm = ({ ref, onDeleted, address, customer }: Props) => {

    const deleteAddress = useDeleteAddress(customer);

    const handleDelete = async () => {
        await deleteAddress.mutateAsync(address!);
        onDeleted();
    };

    return (
        <dialog className="modal" ref={ref}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">¿Deseas eliminar esta dirección de envio?</h3>
                <p>Esta acción es irreversible</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button type="button" className="btn btn-error mr-3 text-white" onClick={() => handleDelete()}>Eliminar</button>
                        <button type="submit" className="btn btn-ghost">Cancelar</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default DeleteAddressForm;