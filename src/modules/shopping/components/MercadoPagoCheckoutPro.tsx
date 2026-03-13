import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

type Props = {
    preferenceId: string | null | undefined;
};

const nodeEnv: string = import.meta.env.VITE_NODE_ENV;

const MercadoPagoCheckoutPro = ({ preferenceId }: Props) => {
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        if (!preferenceId) return;

        const publicKey: string = nodeEnv === "production"
            ? import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY
            : import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY_TEST;

        if (!publicKey) {
            console.error("VITE_MERCADO_PAGO_PUBLIC_KEY no configurada");
            return;
        }

        initMercadoPago(publicKey, { locale: "es-MX" });
        setId(preferenceId);
    }, [preferenceId]); // ← re-ejecutar cuando llegue el preferenceId del servidor

    if (!preferenceId) {
        return (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-base-200 border border-base-300">
                <span className="loading loading-spinner loading-sm text-primary" />
                <span className="text-xs text-base-content/50">Preparando pago...</span>
            </div>
        );
    }

    return id ? <Wallet initialization={{ preferenceId: id }} /> : null;
};

export default MercadoPagoCheckoutPro;