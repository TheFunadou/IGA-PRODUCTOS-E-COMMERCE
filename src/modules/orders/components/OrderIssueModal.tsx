import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaPaperPlane, FaScroll } from "react-icons/fa";
import type { CustomerOrdersDashboardCardI } from "../OrdersTypes";
import { buildIssueMailto } from "../utils/invoice";

const ISSUE_REASONS = [
    { value: "Problema con mi compra", description: "El producto no llegó en las condiciones esperadas o hay una discrepancia en mi pedido." },
    { value: "Cancelación", description: "Quiero cancelar mi pedido antes de que sea enviado." },
    { value: "Reembolso", description: "Necesito el reembolso de mi pago." },
] as const;

type Props = {
    open: boolean;
    order: CustomerOrdersDashboardCardI;
    onClose: () => void;
};

const OrderIssueModal = ({ open, order, onClose }: Props) => {
    const [motive, setMotive] = useState<string>(ISSUE_REASONS[0].value);

    useEffect(() => {
        if (open) setMotive(ISSUE_REASONS[0].value);
    }, [open]);

    if (!open) return null;

    const buyerName = `${order.buyer.name} ${order.buyer.surname}`.trim();

    const handleSend = () => {
        const mailto = buildIssueMailto({
            uuid: order.uuid,
            createdAt: order.createdAt,
            buyerName,
            motive,
        });
        window.location.href = mailto;
        onClose();
    };

    return (
        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="modal-box rounded-2xl p-6 max-w-lg">
                <form method="dialog">
                    <button
                        className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </form>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                        <FaExclamationTriangle className="text-warning" />
                    </div>
                    <div>
                        <h3 className="font-black text-base-content uppercase tracking-tight">
                            ¿Tienes un problema con tu pedido?
                        </h3>
                        <p className="text-xs text-base-content/50 font-medium">
                            Escríbenos y te ayudamos a resolverlo
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">
                            Motivo
                        </label>
                        <select
                            className="select select-bordered select-sm w-full font-bold"
                            value={motive}
                            onChange={(e) => setMotive(e.target.value)}
                        >
                            {ISSUE_REASONS.map((reason) => (
                                <option key={reason.value} value={reason.value}>
                                    {reason.value}
                                </option>
                            ))}
                        </select>
                        <p className="text-[11px] text-base-content/40 leading-snug">
                            {ISSUE_REASONS.find((r) => r.value === motive)?.description}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-base-200 border border-base-300 p-3 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-base-content/40 tracking-widest">
                            <FaScroll className="text-xs" />
                            El correo incluirá
                        </div>
                        <ul className="text-xs text-base-content/70 space-y-1 list-disc list-inside">
                            <li>
                                Motivo: <span className="font-bold text-base-content">{motive}</span>
                            </li>
                            <li>
                                Folio: <span className="font-mono font-bold text-base-content uppercase">{order.uuid}</span>
                            </li>
                            <li>
                                Fecha de compra:{" "}
                                <span className="font-bold text-base-content">
                                    {new Date(order.createdAt).toLocaleDateString("es-MX")}
                                </span>
                            </li>
                            <li>
                                Comprador: <span className="font-bold text-base-content">{buyerName || "—"}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-2xl bg-info/5 border border-info/15 p-3 flex flex-col gap-1">
                        <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">
                            Antes de escribirnos, revisa nuestras políticas
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <Link to="/politica-de-compras" className="link link-info text-xs font-bold">
                                Política de compras
                            </Link>
                            <Link to="/politica-de-devolucion" className="link link-info text-xs font-bold">
                                Política de devolución
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button className="btn btn-ghost btn-sm font-bold" onClick={onClose}>
                            Cerrar
                        </button>
                        <button className="btn btn-primary btn-sm gap-2 font-bold shadow-sm" onClick={handleSend}>
                            <FaPaperPlane className="text-xs" />
                            Enviar por correo
                        </button>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>cerrar</button>
            </form>
        </dialog>
    );
};

export default OrderIssueModal;