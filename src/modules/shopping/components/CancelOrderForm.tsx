import type { RefObject } from "react";

type Props = {
    ref: RefObject<HTMLDialogElement | null>;
    onCanceled: () => Promise<void>;
};

const CancelOrderForm = ({ ref, onCanceled }: Props) => {
    return (
        <dialog className="modal" ref={ref}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Deseas abandonar esta orden de compra? 😥</h3>
                <p>Una vez abandonada la orden no podra ser reactivada</p>
                <div className="modal-action">
                    <form method="dialog" className="flex gap-1 md:gap-3">
                        <button type="button" className="w-fit btn btn-ghost" onClick={() => onCanceled()}>Abandonar orden</button>
                        <button type="submit" className="w-fit btn btn-primary">Continuar</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default CancelOrderForm;