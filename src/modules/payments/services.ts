import api from "../../api/api.config";
import type { OrderStatusType } from "../shopping/ShoppingTypes";
import type { GetPaidOrderDetails } from "./types";


export const getOrderStatusWithDetails = async (args: { orderUUID: string, requiredStatus: OrderStatusType }) => {
    const { requiredStatus } = args;
    const { data } = await api.get<GetPaidOrderDetails>(`/payment/order/status/${args.orderUUID}`, { params: { status: requiredStatus } })
    console.log(JSON.stringify(data, null, 2))
    return data;
};
