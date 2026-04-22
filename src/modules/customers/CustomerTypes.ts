import type { CustomerType } from "../auth/AuthTypes";

export type CustomerAddressType = {
    uuid: string;
    recipientName: string;
    recipientLastName: string;
    country: string;
    state: string;
    city: string;
    locality: string;
    streetName: string;
    neighborhood: string;
    zipCode: string;
    addressType: string;
    floor?: string;
    number: string;
    aditionalNumber?: string;
    referencesOrComments?: string;
    countryPhoneCode: string;
    contactNumber: string;
    defaultAddress: boolean;
};

export type UpdateAddressType = Partial<CustomerAddressType>;
export type NewAddressType = Omit<CustomerAddressType, "uuid">;
export type GuestFormType = Omit<CustomerAddressType, "uuid" | "defaultAddress">;
export type GetCustomerAddressOrderType = NewAddressType & { uuid?: string; };
export type GetCustomerAddressPaymentType = Omit<CustomerAddressType, "uuid" | "defaultAddress">;
export type CustomerAttributes = Pick<CustomerType, "name" | "last_name" | "email">;
export type GuestBillingFormType = Omit<CustomerAddressType, "uuid" | "defaultAddress" | "recipientName" | "recipientLastName"> & {
    moralOrFisical: "moral" | "física";
    rfc: string;
};

export type GuestCreateOrderFormType = Omit<CustomerAddressType, "uuid" | "defaultAddress"> & {
    firstName: string;
    lastName: string;
    email: string;
    consent: boolean;
};


export type onToogleFavoriteType = {
    added: boolean;
    message: string;
};

export type GetCustomerAddressesType = {
    data: CustomerAddressType[];
    totalRecords: number;
    totalPages: number;
};

export type UpdateProfileFormType = {
    name?: string;
    last_name?: string;
    phone?: string;
    email?: string;
    current_password: string;
    new_password?: string;
    confirm_password?: string;
};