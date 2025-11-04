import type { ProductVersionCardType } from "../products/ProductTypes";

export type ShoppingCartType = ProductVersionCardType & {
    isChecked:boolean;
    quantity:number;
};


export type PaymentMethodsType = "mercado_pago" | "paypal" | null;

interface PaymentMethodDetails{
    icon:React.ReactElement;
    description:string;
}