import axios from "axios";
import type { ShoppingCartType } from "../ShoppingTypes";
import { BASE_URL } from "../../../global/GlobalTypes";
import type { PaymentOrder, ProcessOrderType } from "../PaymentTypes";


export const createMercadoPagoOrder = async (data: ProcessOrderType):Promise<PaymentOrder> => {
    const response = await axios.post<PaymentOrder>(`${BASE_URL}/payment/mercado-pago`, data, { withCredentials: true });
    return response.data
};

export const createPaypalOrder = async (items: ShoppingCartType[]) => {
    const response = await axios.post(`${BASE_URL}/payment/paypal`, items, { withCredentials: true });
    return response.data
};