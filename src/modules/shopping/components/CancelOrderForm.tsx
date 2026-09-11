import type { RefObject } from "react";
import { FaTriangleExclamation, FaX } from "react-icons/fa6";

type Props = {
    ref: RefObject<HTMLDialogElement | null>;
    onCanceled: () => Promise<void>;
};

const CancelOrderForm = ({ ref, onCanceled }: Props) => {
    return (
        <dialog className="modal" ref={ref}>
            <div className="modal-box max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-base-100 text-base-content overflow-hidden">

                <form method="dialog">
                    <button type="submit" className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-20 text-base-content/60 hover:text-base-content" aria-label="Cerrar">
                        <FaX />
                    </button>
                </form>

                <div className="flex flex-col gap-4 pt-2 sm:pt-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning/10 text-warning text-[10px] font-bold tracking-[0.2em] uppercase">
                            <FaTriangleExclamation />
                            Confirmar
                        </span>
                    </div>

                    <div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-tight">
                            ¿Abandonar la orden? 😥
                        </h3>
                    </div>

                    <p className="text-sm text-base-content/70 leading-relaxed">
                        Si continúas, la orden quedará marcada como abandonada y no podrá reactivarse.
                    </p>
                    <p className="text-xs text-base-content/40">Esta acción no puede deshacerse.</p>

                    <div className="modal-action mt-2 gap-2">
                        <form method="dialog" className="w-full flex flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                className="btn btn-outline btn-error flex-1 sm:flex-none"
                                onClick={() => onCanceled()}
                            >
                                Abandonar orden
                            </button>
                            <button type="submit" className="btn btn-primary flex-1 sm:flex-none">
                                Continuar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default CancelOrderForm;