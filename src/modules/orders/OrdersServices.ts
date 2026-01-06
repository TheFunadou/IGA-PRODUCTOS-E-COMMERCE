import axios from "axios";
import { BASE_URL } from "../../global/GlobalTypes";
import type { OrderDetailResponse, OrdersType } from "./OrdersTypes";

export const getOrderDetail = async (orderId: string) => {
    try {
        console.log("obteniendo detalle del producto: ", orderId)
        const response = await axios.get<OrderDetailResponse>(`${BASE_URL}/orders/detail/${orderId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener el detalle de la orden");
    }
};

export const getOrders = async (params: { orderby: "asc" | "desc" }) => {
    try {
        const response = await axios.get<OrdersType[]>(`${BASE_URL}/orders`, {
            withCredentials: true,
            params: { orderby: params.orderby }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener las ordenes");
    };
};