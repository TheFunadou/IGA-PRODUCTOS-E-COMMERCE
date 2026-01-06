import axios from "axios";
import type { ShoppingCartType } from "../ShoppingTypes";
import { BASE_URL } from "../../../global/GlobalTypes";
import type { OrderDetailResponse, PaymentOrder, ProcessOrderType } from "../PaymentTypes";


export const createMercadoPagoOrder = async (data: ProcessOrderType): Promise<PaymentOrder> => {
    const response = await axios.post<PaymentOrder>(`${BASE_URL}/payment/mercado-pago`, data, { withCredentials: true });
    return response.data
};

export const createPaypalOrder = async (items: ShoppingCartType[]) => {
    const response = await axios.post(`${BASE_URL}/payment/paypal`, items, { withCredentials: true });
    return response.data
};

export const getOrderDetail = async (orderId: string) => {
    try {
        console.log("obteniendo detalle del producto: ", orderId)
        const response = await axios.get<OrderDetailResponse>(`${BASE_URL}/payment/order/detail/${orderId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error ("Error al obtener el detalle de la orden");
    }
}