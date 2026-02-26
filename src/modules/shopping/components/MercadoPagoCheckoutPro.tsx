import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

type Props = {
    preferenceId: string | null;
};

const nodeEnv = import.meta.env.VITE_NODE_ENV;

const MercadoPagoCheckoutPro = ({ preferenceId }: Props) => {
    if (!preferenceId) throw new Error("Error al construir el boton de pago");
    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        const publicKey: string = nodeEnv === "production" ? import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY : import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY_TEST;
        if (!publicKey) throw new Error("Hubo un error al cargar el botón de pago");
        initMercadoPago(publicKey, { locale: "es-MX" });
        setId(preferenceId);
    }, []);

    return id && <Wallet initialization={{ preferenceId: id }} />;
};

export default MercadoPagoCheckoutPro;