import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

type Props = {
    preferenceId: string | null;
}

const MercadoPagoCheckoutPro = ({ preferenceId }: Props) => {
    if (!preferenceId) throw new Error("Error al construir el boton de pago");
    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        const publicKey: string = import.meta.env.VITE_MP_CHECKOUT_PRO_TEST;
        if (!publicKey) throw new Error("Hubo un error al cargar el botón de pago");
        console.log(publicKey);
        initMercadoPago(publicKey, { locale: "es-MX" });
        setId(preferenceId);
    }, []);

    return id && <Wallet initialization={{ preferenceId: id }} />;
};

export default MercadoPagoCheckoutPro;