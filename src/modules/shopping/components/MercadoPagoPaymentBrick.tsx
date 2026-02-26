/**
 * @deprecated -- inestable
 */
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { useEffect } from 'react';

// Tipos para las props del componente
interface PaymentBrickProps {
    amount: number;
    preferenceId?: string;
}

// Tipos para el formulario de datos de Mercado Pago
interface FormData {
    token: string;
    issuer_id: string;
    payment_method_id: string;
    transaction_amount: number;
    installments: number;
    payer: {
        email: string;
        identification: {
            type: string;
            number: string;
        };
    };
}

interface SubmitParams {
    selectedPaymentMethod: string;
    formData: FormData;
}

const PaymentBrick: React.FC<PaymentBrickProps> = ({
    amount,
    preferenceId = "358310292-33c37727-7942-45e5-beb8-c356f6b270c4" // Preference ID hardcodeado para pruebas
}) => {

    // Configuración de inicialización del Brick
    const initialization = {
        amount: amount,
        preferenceId: preferenceId,
    };

    // Configuración de personalización
    const customization = {
        paymentMethods: {
            creditCard: "all" as const,
            debitCard: "all" as const,
            ticket: "all" as const,
            bankTransfer: "all" as const,
            mercadoPago: "all" as const, // Habilita pago con billetera de Mercado Pago
        },
    };

    // Callback al enviar el formulario
    const onSubmit = async ({ selectedPaymentMethod, formData }: SubmitParams) => {
        console.debug(selectedPaymentMethod);

        return new Promise<void>((resolve, reject) => {
            fetch("/api/process_payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log('Respuesta del pago:', response);
                    // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
                    resolve();
                })
                .catch((error) => {
                    console.error('Error al procesar el pago:', error);
                    // Aquí puedes mostrar un mensaje de error al usuario
                    reject();
                });
        });
    };

    // Callback cuando el Brick está listo
    const onReady = async () => {
        console.log('Payment Brick está listo');
        // Aquí puedes ocultar un loader o mostrar el formulario
    };

    // Callback para manejar errores
    const onError = async (error: any) => {
        console.error('Error en Payment Brick:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
    };

    useEffect(() => { initMercadoPago("TEST-9a9e5845-5bfd-4c28-9290-63a689207ca1", { locale: "es-MX" }) }, []);


    return (
        <div>
            <Payment
                initialization={initialization}
                customization={customization}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onError}
            />
        </div>
    );
};

export default PaymentBrick;