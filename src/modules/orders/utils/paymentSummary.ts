import type { OrderDescriptionIV3 } from "../OrdersTypes";

export const parseFmt = (value?: string | null): number =>
    parseFloat((value ?? "0").replace(/[^0-9.-]/g, "")) || 0;

export const getOrderPaymentTotals = (
    order: Pick<OrderDescriptionIV3, "paymentResume" | "paymentDetails">,
) => {
    const orderTotal = parseFmt(order.paymentResume.total);
    const totalPaid = order.paymentDetails.reduce(
        (acc, det) => acc + parseFmt(det.paidAmount),
        0,
    );
    const hasFinancing = Math.abs(totalPaid - orderTotal) > 0.005;
    const interest = totalPaid - orderTotal;

    return { orderTotal, totalPaid, hasFinancing, interest };
};

export type OrderPaymentTotals = ReturnType<typeof getOrderPaymentTotals>;