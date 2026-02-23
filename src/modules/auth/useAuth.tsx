import { useMutation } from "@tanstack/react-query";
import { useTriggerAlert } from "../alerts/states/TriggerAlert";
import { registerCustomer, sendVerificationToken } from "./services/authServices";
import { useAuthStore } from "./states/authStore";
import type { NewCustomerType } from "./AuthTypes";
import { formatAxiosError } from "../../api/helpers";

export function useSendVerificationToken() {
    const { showTriggerAlert } = useTriggerAlert();
    const { sessionId } = useAuthStore();
    return useMutation({
        mutationFn: async ({ email }: { email: string }): Promise<string> => {
            return await sendVerificationToken({ sessionId: sessionId!, email });
        },
        onSuccess: () => {
            showTriggerAlert("Successfull", "Tu código de verificación ha sidoenviado a tu correo", {
                duration: 3500,
                delay: 1000
            });
        },
        onError: () => {
            showTriggerAlert("Error", "Ocurrio un error al enviar tu código de verificación", {
                duration: 3500
            });
        },
    });
};


export function useResendVerificationToken() {
    const { showTriggerAlert } = useTriggerAlert();
    const { sessionId } = useAuthStore();
    return useMutation({
        mutationFn: async ({ email }: { email: string }): Promise<string> => {
            return await sendVerificationToken({ sessionId: sessionId!, email });
        },
        onSuccess: () => {
            showTriggerAlert("Successfull", "Tu código de verificación ha sido reenviado a tu correo", {
                duration: 3500,
                delay: 1000
            });
        },
        onError: () => {
            showTriggerAlert("Error", "Ocurrio un error al enviar tu código de verificación", {
                duration: 3500
            });
        },
    });
};




export function useRegisterCustomer() {
    const { showTriggerAlert } = useTriggerAlert();
    const { sessionId } = useAuthStore();
    return useMutation({
        mutationFn: async ({ dto, verificationToken }: { dto: NewCustomerType, verificationToken: string }): Promise<string> => {
            return await registerCustomer({ ...dto, session_id: sessionId!, token: verificationToken });
        },
        onSuccess: () => {
            showTriggerAlert("Successfull", "Registrado existosamente", {
                duration: 3500,
                delay: 1000
            });

        },
        onError: (error) => {
            showTriggerAlert("Error", formatAxiosError(error), {
                duration: 3500
            });
        },
    });
};

