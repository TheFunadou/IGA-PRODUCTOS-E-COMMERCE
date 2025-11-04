import type { RefObject } from "react";
import { Link } from "react-router-dom";

type Props = {
    refName: RefObject<HTMLDialogElement | null>;
    onResponse: (response:boolean) => void;
}

const GuestAdvertisement = ({ refName, onResponse }: Props) => {
    return (
        <dialog id="my_modal_3" className="modal" ref={refName}>
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div >
                    <p className="text-xl font-bold">Aviso</p>
                    <div className="mt-5">
                        <p className="text-justify">Los detalles de tu compra seran enviados por correo electronico, pero tu compra no generara un historial en nuestra plataforma, asi como te perderias de otros beneficios y funciones estas seguro de continuar?</p>
                        <div className="w-1/2 flex gap-5 mt-5">
                            <Link to={"/nueva-cuenta"} className="btn btn-primary">Registrarme</Link>
                            <button className="btn btn-error text-white" onClick={() => onResponse(true)}>Quiero continuar como invitado</button>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default GuestAdvertisement;