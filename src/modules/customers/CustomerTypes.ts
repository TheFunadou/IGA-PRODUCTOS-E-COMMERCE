export type CustomerAddressType = {
    uuid: string;
    recipient_name: string;
    recipient_last_name: string;
    country: string;
    state: string;
    city: string;
    locality: string;
    street_name: string;
    neighborhood: string;
    zip_code: string;
    address_type: string;
    floor?: string;
    number: string;
    aditional_number?: string;
    references_or_comments?: string;
    country_phone_code: string;
    contact_number: string;
    default_address: boolean;
};

export type UpdateAddressType = Partial<Omit<CustomerAddressType, "uuid">>;
export type NewAddressType = Omit<CustomerAddressType, "uuid">;
export type GuestFormType = Omit<CustomerAddressType, "uuid" | "default_address">;
export type GuestBillingFormType = Omit<CustomerAddressType, "uuid" | "default_address" | "recipient_name" | "recipient_last_name"> & {
    moral_or_fisical: "moral" | "física";
    rfc: string;
};

export type onToogleFavoriteType = {
    added: boolean;
    message: string;
};