import type { RefObject } from "react";

type Props = {
    ref: RefObject<HTMLDialogElement | null>;
    onResponse: (response: boolean) => void;
};

const ConfirmNavigationCheckout = ({ ref, onResponse }: Props) => {

    return (
        <dialog id="my_modal_3" className="modal" ref={ref}>
            <div className="modal-box">
                <div >
                    <p className="text-xl font-bold">Aviso</p>
                    <div className="mt-5">
                        <p className="text-justify text-lg">Al salir de esta ventana cancelaras el proceso de pago, ¿Estas seguro de querer continuar?.</p>
                        <div className="w-1/2 flex gap-5 mt-5">
                            <button className="btn btn-error text-white" onClick={() => onResponse(true)}>Salir</button>
                            <button className="btn btn-primary" onClick={() => onResponse(false)}>Regresar al pago</button>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmNavigationCheckout;