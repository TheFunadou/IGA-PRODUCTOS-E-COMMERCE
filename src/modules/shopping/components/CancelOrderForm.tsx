import type { RefObject } from "react";

type Props = {
    ref: RefObject<HTMLDialogElement | null>;
    onCanceled: () => void;
};

const CancelOrderForm = ({ ref, onCanceled }: Props) => {
    return (
        <dialog className="modal" ref={ref}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Deseas cancelar esta orden de compra? 😥</h3>
                <p>Una vez cancelada la orden no podra ser reactivada</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button type="button" className="btn btn-ghost mr-3" onClick={() => onCanceled()}>Cancelar orden</button>
                        <button type="submit" className="btn btn-primary">Continuar con la compra</button>

                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default CancelOrderForm;