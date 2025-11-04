import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CustomerAddressType, NewAddressType, UpdateAddressType } from "../CustomerTypes";
import { createAddressService, deleteAddressService, getCustomerAddressesService, updateAddressService } from "../services/CustomerService";
import { buildKey } from "../../../global/GlobalHelpers";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";

export const customerQueryKeys = {
    addresses: (customer: string | undefined) => buildKey("customer:addresses", { customer }),
};

export const useFetchCustomerAddresses = (customer: string | undefined) => {
    return useQuery<CustomerAddressType[]>({
        queryKey: customerQueryKeys.addresses(customer!),
        queryFn: async () => await getCustomerAddressesService(),
        enabled: !!customer,
        staleTime: 10 * 60000,
        gcTime: 15 * 60000,
        refetchOnWindowFocus: false
    });
};

// useAddAddress - CON LÓGICA DE SERVIDOR
export function useAddAddress(customer: string | undefined) {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async (newAddress: NewAddressType): Promise<CustomerAddressType> => {
            return await createAddressService(newAddress);
        },

        onMutate: async (newAddress: NewAddressType) => {
            if (!customer) return { previousAddresses: undefined, tempUUID: "" };

            const queryKey = customerQueryKeys.addresses(customer);
            await queryClient.cancelQueries({ queryKey });

            const previousAddresses = queryClient.getQueryData<CustomerAddressType[]>(queryKey);
            const tempUUID = `temp-${Date.now()}`;

            // ✅ Optimistic update inmediato
            queryClient.setQueryData<CustomerAddressType[]>(
                queryKey,
                (old) => {
                    if (!old) return [{ ...newAddress, uuid: tempUUID } as CustomerAddressType];

                    let updatedAddresses = old;
                    if (newAddress.default_address) {
                        updatedAddresses = old.map(addr => ({ ...addr, default_address: false }));
                    }

                    return [
                        { ...newAddress, uuid: tempUUID } as CustomerAddressType,
                        ...updatedAddresses
                    ];
                }
            );

            return { previousAddresses, tempUUID };
        },

        onSuccess: (savedAddress, newAddress, context) => {
            if (!customer) return;

            const queryKey = customerQueryKeys.addresses(customer);

            // ✅ Invalida para traer el estado real del servidor
            // Esto traerá la data correcta incluyendo cambios del backend
            queryClient.invalidateQueries({ queryKey });

            showTriggerAlert("Successfull", "Dirección de envío creada exitosamente", {
                duration: 3500,
                delay: 1000
            });
        },

        onError: (error, newAddress, context) => {
            if (!customer || !context) return;

            const queryKey = customerQueryKeys.addresses(customer);
            // ✅ Restaurar estado anterior si falla
            queryClient.setQueryData(queryKey, context.previousAddresses);

            console.error('❌ Error al agregar dirección:', error);
            showTriggerAlert("Error", "No se pudo crear la dirección", {
                duration: 3500
            });
        },
    });
}

// useDeleteAddress - CON LÓGICA DE SERVIDOR
export function useDeleteAddress(customer: string | undefined) {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async (addressUUID: string): Promise<string> => {
            return await deleteAddressService(addressUUID);
        },

        onMutate: async (addressUUID: string) => {
            if (!customer) return { previousAddresses: undefined };

            const queryKey = customerQueryKeys.addresses(customer);
            await queryClient.cancelQueries({ queryKey });

            const previousAddresses = queryClient.getQueryData<CustomerAddressType[]>(queryKey);

            // ✅ Optimistic update: remover inmediatamente
            queryClient.setQueryData<CustomerAddressType[]>(
                queryKey,
                (old) => {
                    if (!old) return [];
                    return old.filter(addr => addr.uuid !== addressUUID);
                }
            );

            return { previousAddresses };
        },

        onSuccess: (message) => {
            if (!customer) return;

            const queryKey = customerQueryKeys.addresses(customer);

            // ✅ Invalida para sincronizar con cambios del servidor
            // (por ejemplo, si se asignó automáticamente una nueva dirección default)
            queryClient.invalidateQueries({ queryKey });

            showTriggerAlert("Successfull", message, { duration: 3500, delay: 1000 });
        },

        onError: (error, addressUUID, context) => {
            if (!customer || !context) return;

            // ✅ Restaurar estado anterior si falla
            const queryKey = customerQueryKeys.addresses(customer);
            queryClient.setQueryData(queryKey, context.previousAddresses);

            console.error('❌ Error al eliminar la dirección:', error);
            showTriggerAlert("Error", "No se pudo eliminar la dirección", {
                duration: 3500
            });
        },
    });
};


// useUpdateAddress - CON LÓGICA DE SERVIDOR
export function useUpdateAddress(customer: string | undefined) {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async ({ addressUUID, data }: {
            addressUUID: string;
            data: UpdateAddressType
        }): Promise<string> => {
            return await updateAddressService(addressUUID, data);
        },

        onMutate: async ({ addressUUID, data }) => {
            if (!customer) return { previousAddresses: undefined };

            const queryKey = customerQueryKeys.addresses(customer);
            await queryClient.cancelQueries({ queryKey });

            const previousAddresses = queryClient.getQueryData<CustomerAddressType[]>(queryKey);

            // ✅ Optimistic update inmediato
            queryClient.setQueryData<CustomerAddressType[]>(
                queryKey,
                (old) => {
                    if (!old) return [];

                    return old.map(addr => {
                        // Actualizar la dirección objetivo
                        if (addr.uuid === addressUUID) {
                            return { ...addr, ...data };
                        }

                        // Si se está marcando como default, desmarcar las demás
                        if (data.default_address === true) {
                            return { ...addr, default_address: false };
                        }

                        return addr;
                    });
                }
            );

            return { previousAddresses };
        },

        onSuccess: (message) => {
            if (!customer) return;

            const queryKey = customerQueryKeys.addresses(customer);
            // ✅ Invalida y refetch automático para sincronizar con el estado real del servidor
            // Esto garantiza coherencia con la lógica del backend (ej: asignación automática de default_address)
            queryClient.invalidateQueries({ queryKey });

            showTriggerAlert("Successfull", message, {
                duration: 3500,
                delay: 1000
            });
        },

        onError: (error, data, context) => {
            if (!customer || !context) return;

            const queryKey = customerQueryKeys.addresses(customer);

            // ✅ Restaurar estado anterior si falla
            queryClient.setQueryData(queryKey, context.previousAddresses);

            console.error('❌ Error al actualizar la dirección:', error);
            showTriggerAlert("Error", "No se pudo actualizar la dirección", {
                duration: 3500
            });
        },
    });
};