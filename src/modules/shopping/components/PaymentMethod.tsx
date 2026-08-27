import { SiMercadopago } from "react-icons/si";
import { FaLock } from "react-icons/fa";
import type { PaymentProvidersType } from "../ShoppingTypes";
import clsx from "clsx";

interface PaymentMethodProps {
    paymentProvider: PaymentProvidersType;
    setPaymentProvider: (method: PaymentProvidersType) => void;
}

const PaymentMethod = ({ paymentProvider, setPaymentProvider }: PaymentMethodProps) => (
    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="px-4 py-3 bg-base-200 border-b border-base-300">
            <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                <FaLock className="text-primary" />
                Método de pago
            </h2>
        </div>
        <div className="p-4 flex flex-col gap-2">
            <label
                className={clsx(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                    paymentProvider === "mercado_pago"
                        ? "border-primary/40 bg-primary/5"
                        : "border-base-300 bg-base-200 hover:border-primary/30"
                )}
            >
                <input
                    type="radio"
                    name="payment_method_v3"
                    className="radio radio-primary radio-sm"
                    onClick={() => setPaymentProvider("mercado_pago")}
                />
                <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 font-bold text-sm text-base-content">
                        <SiMercadopago className="text-2xl" />
                        Mercado Pago
                    </span>
                    <span className="text-[10px] text-base-content/50">
                        Crédito, débito, OXXO, MSI y más
                    </span>
                </div>
            </label>
        </div>
    </div>
);

export default PaymentMethod;
